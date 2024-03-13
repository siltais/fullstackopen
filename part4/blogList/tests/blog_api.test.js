const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
]

const newBlog = {
  title: "somewhere else",
  author: "Wikipedia",
  url: "https://en.wiktionary.org/wiki/somewhere_else",
  likes: 1,
}

const missingLikesBlog = {
  title: "most liked",
  author: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/List_of_most-liked_tweets",
}

const missingUrlBlog = {
  title: "React (software)",
  author: "Wikipedia",
}

const missingTitleBlog = {
  author: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/Blog",
}

const updatingBlog =   {
  title: "React Patterns on GitHub",
  author: "Michael Chan.",
  url: "https://github.com/chantastic/sites",
  likes: 999,
}
  


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('correct amount of blogs & blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
  assert(response.body[0].hasOwnProperty('id'))
})

test('HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => { 
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('somewhere else'))
})

test('if the likes property is missing from the request, it will default to the value 0', async () => { 
  await api
    .post('/api/blogs')
    .send(missingLikesBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const savedBlog = response.body.filter(obj => obj.title === missingLikesBlog.title)
  assert(savedBlog[0].hasOwnProperty('likes'))
  assert(savedBlog[0].likes === 0)
})

test('status code "400 Bad Request" if the title or url properties are missing', async () => { 
  await api
    .post('/api/blogs')
    .send(missingTitleBlog)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(missingUrlBlog)
    .expect(400)
  let response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('delete a single blog', async () => { 
  let blogsInDB = await api
    .get('/api/blogs')
  const blogToDelete = blogsInDB.body[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  blogsInDB = await api
    .get('/api/blogs')
  assert.strictEqual(blogsInDB.body.length, initialBlogs.length - 1)
})

test('updating the information of an individual blog post', async () => {
  let blogsInDB = await api
    .get('/api/blogs')
  const blogToUpdate = blogsInDB.body[0]
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatingBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  blogsInDB = await api
    .get('/api/blogs')
  const updatedBlog = blogsInDB.body.find(obj => obj.id === blogToUpdate.id)
  delete updatedBlog.id
  assert.deepStrictEqual(updatedBlog, updatingBlog)    
})

after(async () => {
  await mongoose.connection.close()
})