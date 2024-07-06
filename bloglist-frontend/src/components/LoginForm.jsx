import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = ({ setMessage, setUser }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({ username, password })
			window.localStorage.setItem(
				'loggedBloglistUser',
				JSON.stringify(user)
			)
			blogService.setToken(user.token)

			setUser(user)
			setUsername('')
			setPassword('')

			setMessage({
				text: `welcome back, ${user.name}!`,
				type: 'success',
			})
			setTimeout(() => {
				setMessage({ text: null, type: null })
			}, 5000)
		} catch (e) {
			setMessage({
				text: 'wrong username or password',
				type: 'error',
			})
			setTimeout(() => {
				setMessage({ text: null, type: null })
			}, 5000)
		}
	}

	return (
		<form onSubmit={handleLogin}>
			<h3>login</h3>
			<div>
				<span style={{ marginRight: '8px' }}>username</span>
				<input
					type='text'
					value={username}
					name='Username'
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				<span style={{ marginRight: '8px' }}>password</span>
				<input
					type='password'
					value={password}
					name='Password'
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type='submit'>login</button>
		</form>
	)
}

LoginForm.propTypes = {
	setMessage: PropTypes.func.isRequired,
	setUser: PropTypes.func.isRequired,
}

export default LoginForm
