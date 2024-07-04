const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
}

const mostBlogs = (blogs) => {
    const countByAuthor = lodash.countBy(blogs, 'author');
    const authorCounts = lodash.toPairs(countByAuthor);
    const maxAuthor = lodash.maxBy(authorCounts, 1);
    return { author: maxAuthor[0], blogs: maxAuthor[1] };
}

const mostLikes = (blogs) => {
    const groupedByAuthor = lodash.groupBy(blogs, 'author');
    const likesByAuthor = lodash.mapValues(groupedByAuthor, (blogs) => lodash.sumBy(blogs, 'likes'));
    const authorLikes = lodash.toPairs(likesByAuthor);
    const maxAuthor = lodash.maxBy(authorLikes, 1);
    return { author: maxAuthor[0], likes: maxAuthor[1] };
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}