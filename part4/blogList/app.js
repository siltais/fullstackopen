const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
app.use(middleware.tokenExtractor)
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentRouter = require('./controllers/comments')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.set('strictQuery',false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(() => {
  logger.info('connected to MongoDB')
})
.catch(error => {
  logger.error('error connecting to MongoDB:', error.message)
})


app.use(express.json())
app.use(cors())
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/comments', commentRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.errorHandler)

module.exports = app