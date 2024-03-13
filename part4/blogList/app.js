const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
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
app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app