import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    }
  }
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.createNew(content)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (id, likedBlog) =>{
  return async dispatch => {
    await blogService.updateBlog(id, likedBlog)
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))    
  }
}

export default blogSlice.reducer