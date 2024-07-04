const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://absolutepraya:${password}@bloglist.qwdbj1k.mongodb.net/testBloglistApp?retryWrites=true&w=majority&appName=bloglist`

mongoose.set('strictQuery', false)

mongoose.connect(url).then(() => {
    const blogSchema = new mongoose.Schema({
        title: String,
        author: String,
        url: String,
        likes: Number
    })

    const Blog = mongoose.model('Blog', blogSchema)

    // add some new blogs
    // const blogs = [
    //     new Blog({
    //         title: 'Understanding Async/Await in JavaScript',
    //         author: 'Jane Doe',
    //         url: 'https://example.com/async-await',
    //         likes: 150
    //     }),
    //     new Blog({
    //         title: 'Principles of Object-Oriented Programming',
    //         author: 'John Smith',
    //         url: 'https://example.com/oop-principles',
    //         likes: 100
    //     }),
    //     new Blog({
    //         title: 'Introduction to React Hooks',
    //         author: 'Alex Johnson',
    //         url: 'https://example.com/react-hooks',
    //         likes: 200
    //     }),
    //     new Blog({
    //         title: 'Demystifying GraphQL',
    //         author: 'Emily White',
    //         url: 'https://example.com/graphql',
    //         likes: 250
    //     })
    // ]

    // blogs.forEach(blog => {
    //     blog.save().then(result => {
    //         console.log(`blog saved: ${result.title}`)
    //     })
    // })

    // print all blogs
    Blog.find({}).then(result => {
        result.forEach(blog => {
            console.log(blog)
        })
        mongoose.connection.close()
    })
})