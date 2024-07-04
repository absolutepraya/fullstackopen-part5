const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

console.log('\n—————————————————————————————————————————————\n') // to add spacing when run sequentially manually

describe('dummy test', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

describe('total likes', () => {

    test('sum of likes from one blog', () => {
        const result = listHelper.totalLikes(helper.oneBlog)
        assert.strictEqual(result, 5)
    })

    test('sum of likes from multiple blogs', () => {
        const result = listHelper.totalLikes(helper.blogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('favorite blog from one blog', () => {
        const result = listHelper.favoriteBlog(helper.oneBlog)
        assert.deepStrictEqual(result, helper.oneBlog[0])
    })

    test('favorite blog from multiple blogs', () => {
        const result = listHelper.favoriteBlog(helper.blogs)
        assert.deepStrictEqual(result, helper.blogs[2])
    })
})

describe('most blogs', () => {
    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(helper.blogs)
        assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('most likes', () => {
    test('author with most likes', () => {
        const result = listHelper.mostLikes(helper.blogs)
        assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
    })
})