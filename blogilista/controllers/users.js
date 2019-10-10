const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.status(200).json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {

  const body = request.body
  if (!body.password || body.password.length < 3) {
    return response.status(400).json({ error: 'bad password' }).end()
  }
  const saltRounds = 10
  const passwordHash = bcrypt.hashSync(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })
  try {
    const savedUser = await user.save()

    response.status(200).json(savedUser)
  } catch(exception) {
    return response.status(400).json({ error: 'problem with username' }).end()
  }
})

module.exports = usersRouter