import { useState, useEffect } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	const [blogTitle, setBlogTitle] = useState('');
	const [blogUrl, setBlogUrl] = useState('');

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		
		try {
			const user = await loginService.login({ username, password });
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (e) {
			console.error('login failed: ', e);
			// TODO: implement error notification
		}
	}

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
		} catch (e) {
			console.error('blog creation failed: ', e);
		}
	}

	return (
		<div>

			<h2>bloglist app</h2>

			{/* TODO: implement error noti inside the page */}

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

					<BlogForm
						handleNewBlog={handleNewBlog}
						blogTitle={blogTitle}
						setBlogTitle={setBlogTitle}
						blogUrl={blogUrl}
						setBlogUrl={setBlogUrl}
					/>
				</div>
			)}

			<br/>

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
