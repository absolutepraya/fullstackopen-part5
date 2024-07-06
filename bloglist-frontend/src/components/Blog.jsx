import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = ({ blog, setMessage, user, setBlogs }) => {
    const [detailView, setDetailView] = useState(false)
    const [likes, setLikes] = useState(blog.likes)

    const handleLikeUpdate = async () => {
        const updatedLikes = likes + 1
        const blogToUpdate = {
            ...blog,
            author: blog.author.id,
            likes: updatedLikes,
        }
        try {
            await blogService.update(blogToUpdate.id, blogToUpdate)
            setLikes(updatedLikes)
        } catch (e) {
            setMessage({
                text: 'failed to update likes (login if you haven\'t)',
                type: 'error',
            })
            setTimeout(() => {
                setMessage({ text: null, type: null })
            }, 5000)
        }
    }

    const handleBlogDelete = async () => {
        if (
            window.confirm(`remove blog ${blog.title} by ${blog.author.name}?`)
        ) {
            try {
                await blogService.remove(blog.id)
                await blogService.getAll().then((blogs) => setBlogs(blogs))
                setMessage({
                    text: `blog ${blog.title} by ${blog.author.name} removed`,
                    type: 'success',
                })
                setTimeout(() => {
                    setMessage({ text: null, type: null })
                }, 5000)
            } catch (e) {
                setMessage({
                    text: 'failed to remove blog',
                    type: 'error',
                })
                setTimeout(() => {
                    setMessage({ text: null, type: null })
                }, 5000)
            }
        }
    }

    return (
        <div className='blog'>
            <div>
                {blog.title} by{' '}
                <span className='detail-span'>{blog.author.name}</span>
                <button onClick={() => setDetailView(!detailView)}>view</button>
            </div>
            <div>
                {detailView && (
                    <div>
                        <div>
                            <a href={blog.url}>{blog.url}</a>
                        </div>
                        <div>
                            <span className='detail-span'>likes {likes}</span>
                            <button onClick={() => handleLikeUpdate()}>
								like
                            </button>
                        </div>
                        <div>{blog.author.name}</div>
                    </div>
                )}
            </div>
            <div>
                {user && user.username === blog.author.username && (
                    <button onClick={() => handleBlogDelete()}>remove</button>
                )}
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    user: PropTypes.object,
    setBlogs: PropTypes.func.isRequired,
}

export default Blog
