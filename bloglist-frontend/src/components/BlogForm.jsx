import { useState } from 'react';

import blogService from '../services/blogs';

const BlogForm = ({ setBlogs, setMessage, user, toggleFormVisibility }) => {
	const [blogTitle, setBlogTitle] = useState('');
	const [blogUrl, setBlogUrl] = useState('');

	const handleNewBlog = async (event) => {
		event.preventDefault();

		const newBlog = {
			title: blogTitle,
			author: user.id,
			url: blogUrl,
		};
		
		// THIS PART!!!
		toggleFormVisibility();

		try {
			await blogService.create(newBlog);
			await blogService.getAll().then((blogs) => setBlogs(blogs));

			setBlogTitle('');
			setBlogUrl('');

			setMessage({
				text: `a new blog ${newBlog.title} by ${user.name} added`,
				type: 'success',
			});
			setTimeout(() => {
				setMessage({ text: null, type: null });
			}, 5000);
		} catch (e) {
			setMessage({
				text: 'failed to create a new blog',
				type: 'error',
			});
			setTimeout(() => {
				setMessage({ text: null, type: null });
			}, 5000);
		}
	};

	return (
		<div>
			<h3>create new blog</h3>
			<form onSubmit={handleNewBlog}>
				<div>
					<span style={{ marginRight: '8px' }}>title</span>
					<input
						type='text'
						value={blogTitle}
						name='Title'
						onChange={({ target }) => setBlogTitle(target.value)}
					/>
				</div>
				<div>
					<span style={{ marginRight: '8px' }}>url</span>
					<input
						type='text'
						value={blogUrl}
						name='Url'
						onChange={({ target }) => setBlogUrl(target.value)}
					/>
				</div>
				<button type='submit'>create</button>
			</form>
		</div>
	);
};

export default BlogForm;
