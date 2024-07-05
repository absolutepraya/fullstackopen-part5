import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState({ text: null, type: null });

	const blogFormRef = useRef();

	// to get all blogs from the server
	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	// to check if user is already logged in
	useEffect(() => {
		const loggedUserJSON =
			window.localStorage.getItem('loggedBloglistUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	return (
		<div>
			<h2>bloglist app</h2>

			<Notification
				text={message.text}
				type={message.type}
			/>

			{user === null ? (
				<Togglable buttonLabel='login'>
					<LoginForm
						setMessage={setMessage}
						setUser={setUser}
					/>
				</Togglable>
			) : (
				<div>
					<p>(^_^)✌🏻 logged in as {user.name}</p>
					<button
						onClick={() => {
							window.localStorage.removeItem(
								'loggedBloglistUser'
							);
							setUser(null);

							setMessage({
								text: 'logged out successfully',
								type: 'success',
							});
							setTimeout(() => {
								setMessage({ text: null, type: null });
							}, 5000);
						}}
					>
						logout
					</button>

					<Togglable buttonLabel='create new blog' ref={blogFormRef}>
						<BlogForm
							setBlogs={setBlogs}
							setMessage={setMessage}
							user={user}
							toggleFormVisibility={() => blogFormRef.current.toggleVisibility()}
						/>
					</Togglable>
				</div>
			)}

			<h3>blogs</h3>

			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
				/>
			))}
		</div>
	);
};

export default App;
