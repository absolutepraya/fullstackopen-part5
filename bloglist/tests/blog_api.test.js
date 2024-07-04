const { test, after, beforeEach, before, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

console.log('\n—————————————————————————————————————————————\n') // to add spacing when run sequentially manually

let token1 = ''
let token2 = ''

let id1 = ''
let id2 = ''

// before all test, clear the users and re-add the initial users
before(async () => {
    // clear users
    await User.deleteMany({})

    // insert users
    let users = helper.users
    for (let user of users) {
        const hashedPassword = await helper.hashPassword(user.passwordHash)
        user.passwordHash = hashedPassword

        const userToInsert = new User(user)
        await userToInsert.save()
    }
    
    // get the token for the 1st user
    let response = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'secretpassword123' })
        .expect(200)
    token1 = response.body.token

    // get the token for the 2nd user
    response = await api
        .post('/api/login')
        .send({ username: 'testuser2', password: 'secretpassword456' })
        .expect(200)
    token2 = response.body.token

    // get the id for the 1st user
    let user = await User.findOne({ username: 'testuser' })
    id1 = user.id

    // get the id for the 2nd user
    user = await User.findOne({ username: 'testuser2' })
    id2 = user.id
})

// before each test, clear the database and re-add the initial blogs
beforeEach(async () => {
    // clear blogs
    await Blog.deleteMany({})

    // modify helper.blogs from index 0 - 3 to be added by the first user
    const modifiedBlogs1 = helper.blogs.slice(0, 4).map(blog => {
        return { ...blog, author: id1 }
    })

    // modify helper.blogs from index 4 - 5 to be added by the second user
    const modifiedBlogs2 = helper.blogs.slice(4).map(blog => {
        return { ...blog, author: id2 }
    })

    // insertMany the first modified blogs 
    await Blog.insertMany(modifiedBlogs1)
    await Blog.insertMany(modifiedBlogs2)
})


describe('api GET test', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are 6 blogs', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, 6)
    })

    test('the first blog is about React patterns', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(e => e.title)
        assert(titles.includes('React patterns'))
    })

    test('id is defined', async () => {
        const response = await api.get('/api/blogs')
        
        // check all blogs have id and not _id
        response.body.forEach(blog => {
            assert(blog.id)
            assert(!blog._id)
        })
    })
})

describe('api POST test', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Star Wars',
            author: id1,
            url: 'https://starwars.com',
            likes: 100
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token1}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // check if the new blog is added
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

        // check if the new blog is in the list
        const titles = blogsAtEnd.map(e => e.title)
        assert(titles.includes('Star Wars'))
    })

    test('if likes is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'Star Wars',
            author: id1,
            url: 'https://starwars.com'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token1}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd.find(blog => blog.title === 'Star Wars')
        assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title/url is not added', async () => {
        let newBlog = {
            title: '',
            author: id2,
            url: 'https://example.com',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token2}`)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length)

        // check if url is missing
        newBlog.title = 'Title'
        newBlog.url = ''

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token2}`)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd2 = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd2.length, helper.blogs.length)
    })

    test('if token is missing, return 401', async () => {
        const newBlog = {
            title: 'Star Wars',
            author: id2,
            url: 'https://starwars.com',
            likes: 100
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
        
        assert(response.body.error.toLowerCase().includes('unauthorized'))

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
    })
})

describe('api DELETE test' , () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length - 1)

        const titles = blogsAtEnd.map(e => e.title)
        assert(!titles.includes(blogToDelete.title))
    })
    
    test('if token is missing, return 401', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const response = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
        
        assert(response.body.error.toLowerCase().includes('unauthorized'))

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
    })

    test('if the user is not the author, return 401', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const response = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token2}`)
            .expect(401)
        
        assert(response.body.error.toLowerCase().includes('unauthorized'))

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
    })
})

describe('api PUT test', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: 'Updated Title',
            author: id2,
            url: 'https://updated.com',
            likes: 999
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token1}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        
        const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        assert.strictEqual(updatedBlogInDb.title, updatedBlog.title)
        assert.strictEqual(updatedBlogInDb.author.toString(), updatedBlog.author)
        assert.strictEqual(updatedBlogInDb.url, updatedBlog.url)
        assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
    })

    test('if nothing is updated, return 400', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token1}`)
            .send({})
            .expect(400)
    })

    test('if token is missing, return 401', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: 'Updated Title',
            author: id2,
            url: 'https://updated.com',
            likes: 999
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(401)

        assert(response.body.error.toLowerCase().includes('unauthorized'))
    })

    test('if the user is not the author, return 401', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: 'Updated Title',
            author: id2,
            url: 'https://updated.com',
            likes: 999
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token2}`)
            .send(updatedBlog)
            .expect(401)
        
        assert(response.body.error.toLowerCase().includes('unauthorized'))
    })
})

after(async () => {
    await mongoose.connection.close()
})