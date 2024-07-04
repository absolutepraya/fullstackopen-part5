const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all blogs
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('author', { username: 1, name: 1 })
    res.json(blogs)
})

// add a new blog
blogsRouter.post('/', async (req, res) => {
    const body = req.body
    const user = req.user

    // error 401 if user is not logged in
    if (!user) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    const blog = new Blog({
        title: body.title,
        author: user.id,
        url: body.url,
        likes: body.likes
    })

    // error 400 if title or url are not present
    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'title or url missing' })
    }


    const savedBlog = await blog.save()

    // add the blog to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    res.status(201).json(savedBlog)
})

// delete a blog
blogsRouter.delete('/:id', async (req, res) => {
    const user = req.user

    // error 401 if user is not logged in
    if (!user) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    // check if the user is the author
    const blog = await Blog.findById(req.params.id)
    if (blog.author.toString() !== user.id) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    // remove the blog from user's blogs array
    user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

// update a blog
blogsRouter.put('/:id', async (req, res) => {
    const user = req.user

    // error 401 if user is not logged in
    if (!user) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    // check if the user is the author
    const blog = await Blog.findById(req.params.id)
    if (blog.author.toString() !== user.id) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    // if nothing is passed in the request body, return 400
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'nothing to update' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedBlog)
})

module.exports = blogsRouter