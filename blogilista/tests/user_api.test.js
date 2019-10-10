const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    username: 'jasmaki',
    name: 'Jaska',
    password: 'salasana'
  },
  {
    username: 'Dragonslayer',
    name: 'Tero',
    password: 'qwertyuiop'
  }
]

beforeEach(async () => {
  await User.deleteMany({})

  let userObject = new User(initialUsers[0])
  await userObject.save()

  userObject = new User(initialUsers[1])
  await userObject.save()
})

test('users are returned as JSON', async () => {
  const response = await api.get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('adding a user is possible and it is saved correctly', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: 'some_user',
    name: 'Anna',
    password: 'salasana123'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newResponse = await api.get('/api/users')
  expect(newResponse.body.length).toBe(originalLength + 1)
  expect(newResponse.body[originalLength].username).toEqual('some_user')
  expect(newResponse.body[originalLength].name).toEqual('Anna')
})

test('an empty username results in error', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: '',
    name: 'Anna',
    password: 'salasana123'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  expect(secondResponse.body.length).toBe(originalLength)
})

test('a short username results in error', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: 'a',
    name: 'Anna',
    password: 'salasana123'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  expect(secondResponse.body.length).toBe(originalLength)
})

test('the same username cannot be added twice', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: 'Dragonslayer',
    name: 'Anna',
    password: 'salasana123'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  expect(secondResponse.body.length).toBe(originalLength)
})

test('an empty password results in error', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: 'some_user',
    name: 'Anna',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  expect(secondResponse.body.length).toBe(originalLength)
})

test('a short password results in error', async () => {
  const response = await api.get('/api/users')
  const originalLength = response.body.length
  const newUser = {
    username: 'some_user',
    name: 'Anna',
    password: 'a'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  expect(secondResponse.body.length).toBe(originalLength)
})
/*
test('correct number of users are returned', async () => {
  const response = await api.get('/api/users')

  expect(response.body.length).toBe(2)
})

test('identifier field of a user is called id', async () => {
  const response = await api.get('/api/users')

  expect(response.body[0].id).toBeDefined()
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
}) */

afterAll(() => {
  mongoose.connection.close()
})