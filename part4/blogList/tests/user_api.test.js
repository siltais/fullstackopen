const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    const newUser = {
      username: 'simpleUser',
      name: 'Matias Rianio',
      password: 'super',
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)

    const usernames = usersAtEnd.body.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('user with username that has less than 3 characters is not created', async () => {
    const usersAtStart = await api
    .get('/api/users')
    
    const newUser = {
      username: 'si',
      name: 'Matias Rianio',
      password: 'super',
    }
    
    const message = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    assert(message.body.error.includes('User validation failed:'))
  })

  test('user with no username is not created', async () => {
    const usersAtStart = await api
    .get('/api/users')
    
    const newUser = {
      name: 'Matias Rianio',
      password: 'super',
    }
    
    const message = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    assert(message.body.error.includes('User validation failed:'))
  })

  test('user with password that has less than 3 characters is not created', async () => {
    const usersAtStart = await api
    .get('/api/users')
    
    const newUser = {
      username: 'anotherUser',
      name: 'Matias Rianio',
      password: 'eo',
    }

    const errorMsg = {
        error: 'Password must be at least 3 characters long'
    }
    
    const message = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    assert.deepStrictEqual(errorMsg, message.body)
  })

  test('user with no password is not created', async () => {
    const usersAtStart = await api
    .get('/api/users')
    
    const newUser = {
      username: 'anotherUser',
      name: 'Matias Rianio',
    }

    const errorMsg = {
        error: 'Password must be at least 3 characters long'
    }
    
    const message = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    assert.deepStrictEqual(errorMsg, message.body)
  })

  test('user with existing username is not created', async () => {
    const usersAtStart = await api
    .get('/api/users')
    
    const newUser = {
      username: 'root',
      name: 'Matias Rianio',
      password: 'password',
    }

    const errorMsg = {
        error: 'expected `username` to be unique'
    }
    
    const message = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)


    const usersAtEnd = await api
    .get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    assert.deepStrictEqual(errorMsg, message.body)
  })


})



after(async () => {
  await mongoose.connection.close()
})