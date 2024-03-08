const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  

const totalLikes = (blogs) => {
  const initialValue = 0
  const sumWithInitial = blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    initialValue,
  )
  return sumWithInitial
}

const favoriteBlog = (blogs) => {

  let maxLikes = 0
  let hasMaxLikes = 0

  blogs.map((blog, i) => {
    if(blog.likes > maxLikes){
      maxLikes = blog.likes
      hasMaxLikes = i
    }
  })

  const favorite = {
    title: blogs[hasMaxLikes].title,
    author: blogs[hasMaxLikes].author,
    likes: blogs[hasMaxLikes].likes
  }

  return favorite
}

const mostBlogs = (blogs) => {

  const groupedBlogs = _.groupBy(blogs, 'author')
  const maxCount = _.max(_.map(groupedBlogs, group => group.length))
  const objectWithMaxCount = _.find(groupedBlogs, group => group.length === maxCount)
  
  const maxBlogs = {
    author: objectWithMaxCount[0].author,
    blogs: objectWithMaxCount.length
  }
    
  return maxBlogs
}

const mostLikes = (blogs) => {
  
  const groupedBlogs = _.groupBy(blogs, 'author')
  const likesCount = {}
  
  _.forEach(groupedBlogs, (personLikes, author) => {
    likesCount[author] = _.sumBy(personLikes, 'likes')
  })
  
  const maxLikesPerson = _.maxBy(Object.keys(likesCount), person => likesCount[person])
  
  const maxLikes = {
    author: maxLikesPerson,
    likes: likesCount[maxLikesPerson]
  }
    
  return maxLikes

}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}