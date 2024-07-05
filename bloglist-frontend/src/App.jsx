import { useState, useEffect } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	const [blogTitle, setBlogTitle] = useState('');
	const [blogUrl, setBlogUrl] = useState('');
	const [message, setMessage] = useState({ text: null, type: null });

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

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem(
				'loggedBloglistUser',
				JSON.stringify(user)
			);
			blogService.setToken(user.token);

			setUser(user);
			setUsername('');
			setPassword('');

			setMessage({
				text: `welcome back, ${user.name}!`,
				type: 'success',
			});
			setTimeout(() => {
				setMessage({ text: null, type: null });
			}, 5000);
		} catch (e) {
			setMessage({
				text: 'wrong username or password',
				type: 'error',
			});
			setTimeout(() => {
				setMessage({ text: null, type: null });
			}, 5000);
		}
	};

	const handleNewBlog = async (event) => {
		event.preventDefault();

		const newBlog = {
			title: blogTitle,
			author: user.id,
			url: blogUrl,
		};

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
			<h2>bloglist app</h2>

			<Notification
				text={message.text}
				type={message.type}
			/>

			{user === null ? (
				<LoginForm
					handleLogin={handleLogin}
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
				/>
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

					<BlogForm
						handleNewBlog={handleNewBlog}
						blogTitle={blogTitle}
						setBlogTitle={setBlogTitle}
						blogUrl={blogUrl}
						setBlogUrl={setBlogUrl}
					/>
				</div>
			)}

			<br />

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
