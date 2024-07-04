const { test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

console.log('\n—————————————————————————————————————————————\n') // to add spacing when run sequentially manually

// do a test to POST to /api/login
describe('POST to /api/login', () => {
    test('create 2 users and do a login', async () => {
        await User.deleteMany({})

        // check if it's really cleared
        const usersAtStart = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, 0)

        let users = helper.users
        for (let user of users) {
            const hashedPassword = await helper.hashPassword(user.passwordHash)
            user.passwordHash = hashedPassword

            const userToInsert = new User(user)
            await userToInsert.save()
        }

        // check if the users are inserted
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, helper.users.length)

        const response = await api
            .post('/api/login')
            .send({ "username": 'testuser', "password": 'secretpassword123' })
            .expect(200)
    })

    test('check if the token is returned', async () => {
        const response = await api
            .post('/api/login')
            .send({ "username": 'testuser', "password": 'secretpassword123' })
            .expect(200)
        
        assert(response.body.token)
    })
})

after (async () => {
    await mongoose.connection.close()
})