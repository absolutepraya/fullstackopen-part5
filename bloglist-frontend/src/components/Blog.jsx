import { useState } from 'react';

const Blog = ({ blog }) => {
	const [detailView, setDetailView] = useState(false);

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
							<span className='detail-span'>
								likes {blog.likes}
							</span>
							<button>like</button>
						</div>
						<div>{blog.author.name}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Blog;
