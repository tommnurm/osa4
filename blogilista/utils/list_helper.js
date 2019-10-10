const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (best, item) => {
    if (item.likes > best.likes) {
      return item
    } else {
      return best
    }
  }
  return blogs.length === 0
    ? 'no blogs available'
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return 'no blogs available'
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 }
  } else {
    const authorBlogs = []
    let currentBlogs = [...blogs]
    let currentLength = currentBlogs.length

    while (currentLength > 0) {
      const firstBlog = currentBlogs[0]
      const newBlogs = _.filter(currentBlogs, (blog) => blog.author !== firstBlog.author)
      authorBlogs.push({ author: firstBlog.author, blogs: currentLength-newBlogs.length })
      currentBlogs = newBlogs
      currentLength = currentBlogs.length
    }
    const bestAuthor = _.maxBy(authorBlogs, 'blogs')
    return bestAuthor
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'no blogs available'
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, likes: blogs[0].likes }
  } else {
    const authorLikes = []
    let currentBlogs = [...blogs]
    let currentLength = currentBlogs.length

    while (currentLength > 0) {
      const firstBlog = currentBlogs[0]
      const [blogsByAuthor, newBlogs] = _.partition(currentBlogs, (blog) => blog.author === firstBlog.author)
      const likesByAuthor = blogsByAuthor.map(blog => blog.likes)
      authorLikes.push({ author: firstBlog.author, likes: _.sum(likesByAuthor) })
      currentBlogs = newBlogs
      currentLength = currentBlogs.length
    }
    const mostLikes = _.maxBy(authorLikes, 'likes')
    return mostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}