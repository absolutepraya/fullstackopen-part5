const LoginForm = ({
	handleLogin,
	username,
	setUsername,
	password,
	setPassword,
}) => {
	return (
		<form onSubmit={handleLogin}>
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
	);
};

export default LoginForm;
