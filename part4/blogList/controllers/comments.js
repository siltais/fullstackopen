const jwt = require('jsonwebtoken')
const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({})
    .populate('blog', { title: 1, author: 1 })
  response.json(comments)
})
  
commentsRouter.post('/', async (request, response) => {
  const body = request.body
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const comment = new Comment({
    comment: body.comment,
    blog: body.blogId
  })
  const savedComment = await comment.save()
  const blog = await Blog.findById(body.blogId)
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  response.status(201).json(savedComment)
})

commentsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog.comments.forEach(async item => {
    await Comment.findByIdAndDelete(item)
  });
})

module.exports = commentsRouter