const Blog = ({ blog }) => (
	<div>
		{blog.title} by {blog.author.name}
	</div>
);

export default Blog;
