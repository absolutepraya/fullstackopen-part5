import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const request = axios.get(baseUrl)
	const response = await request
	return response.data
}

const create = async (newBlog) => {
	const config = {
		headers: { Authorization: token },
	}

	const response = await axios.post(baseUrl, newBlog, config)
	return response.data
}

const update = async (id, newBlog) => {
	const response = await axios.put(`${baseUrl}/${id}`, newBlog)
	return response.data
}

export default { setToken, getAll, create, update }