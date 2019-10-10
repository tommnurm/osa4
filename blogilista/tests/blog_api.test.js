const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as JSON', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of JSON blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(2)
})

test('identifier field of a blog is called id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('adding blogs is possible and content is saved correctly', async () => {
  const response = await api.get('/api/blogs')
  const originalLength = response.body.length
  const newBlog = new Blog({
    title: 'interesting blog',
    author: 'Juha',
    url: 'somewebsite',
    likes: 5
  })
  await api
    .post('/api/blogs')
    .send(newBlog)

  const secondResponse = await api.get('/api/blogs')
  expect(secondResponse.body.length).toBe(originalLength + 1)
  expect(secondResponse.body[originalLength].title).toEqual('interesting blog')
})

test('leaving the likes field blank when adding a blog results in 0 likes', async () => {
  const newBlog = new Blog({
    title: 'my dumb blog',
    author: 'Wolfgang',
    url: 'thisisasite'
  })

  await api
    .post('/api/blogs')
    .send(newBlog)

  const response = await api.get('/api/blogs')
  const likes = response.body[response.body.length-1].likes
  expect(likes).toBe(0)
})

test('leaving the title and url fields blank when adding a blog results in error', async () => {
  const newBlog = new Blog({
    author: 'Wolfgang',
    likes: 4
  })
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('it is possible to delete a blog', async () => {
  const response = await api.get('/api/blogs')
  const size = response.length
  const id = response.body[0].id
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)
  let newBlogs = await api.get('/api/blogs')
  newBlogs = newBlogs.body.map(blog => blog.id)
  expect(newBlogs.length === size-1)
  expect(newBlogs).not.toContain(id)
})

test('it is possible to update the likes of a blog', async () => {
  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0]
  const updatedBlog = {
    likes: blogToUpdate.likes+10000
  }
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog )

  const newBlogs = await api.get('/api/blogs')
  expect(newBlogs.body[0].likes).toBe(updatedBlog.likes)
})

afterAll(() => {
  mongoose.connection.close()
})