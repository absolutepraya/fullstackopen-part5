const BlogForm = ({
	handleNewBlog,
	blogTitle,
	setBlogTitle,
	blogUrl,
	setBlogUrl,
}) => {
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