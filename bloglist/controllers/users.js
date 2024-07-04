const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    // check if username is already taken
    const checkUser = await User.findOne({ username })
    if (checkUser) {
        return res.status(400).json({ error: 'username already taken' })
    }

    // check if username is at least 3 characters long
    if (username.length < 3) {
        return res.status(400).json({ error: 'username must be at least 3 characters long' })
    }

    // check if password is at least 3 characters long
    if (password.length < 3) {
        return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter