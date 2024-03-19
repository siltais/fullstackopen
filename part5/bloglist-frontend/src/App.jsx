import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [displayMessage, setDisplayMessage] = useState(null)
  const [messageClass, setMessageClass] = useState('')

  const [newBlog, setNewBlog] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    if(user !== null){
      blogService.getAll().then(blogs =>
        setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
      )
    }
  }, [user, newBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      sendMessage('error', 'Wrong username or password')
      setTimeout(() => {
        clearMessage()
      }, 5000)
    }
  }

  const clearMessage = () => {
    setDisplayMessage(null)
    setMessageClass('')
  }

  const sendMessage = (msgClass, textToSend) => {
    setMessageClass(msgClass)
    setDisplayMessage(textToSend)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try{
      const createNew = await blogService
        .createNew(blogObject)
        setNewBlog(createNew)
        blogFormRef.current.toggleVisibility()
        sendMessage('success', `a new blog ${createNew.title} by ${createNew.author} added`)
        setTimeout(() => {
          clearMessage()
        }, 5000)
    } catch (exception) {
      sendMessage('error', 'Something went wrong! Couldn`t save the new blog.')
      setTimeout(() => {
        clearMessage()
      }, 5000)
    }
  }
  
  const handleAddLike = async (blogToLike) => {
    try {
      const updatedBlog = {
        likes:blogToLike.likes + 1, 
        author:blogToLike.author, 
        title:blogToLike.title, 
        url:blogToLike.url, 
        user:blogToLike.user.id
      }
      await blogService
        .updateBlog( blogToLike.id, updatedBlog ) 
      setNewBlog(updatedBlog)
    } catch (exception) {
      sendMessage('error', 'Something went wrong! Couldn`t add like to the blog.')
      setTimeout(() => {
        clearMessage()
      }, 5000)
    }
  }

  const handleRemoveBlog = async (blogToDelete) => {
    try {
      if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)){
        await blogService
          .removeBlog( blogToDelete.id )
        setNewBlog(blogToDelete)
      }
    } catch (exception) {
      sendMessage('error', 'Something went wrong! Couldn`t delete the blog.')
      setTimeout(() => {
        clearMessage()
      }, 5000)
    }
  }

  const loginForm = () => (   
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div className = {messageClass}>
        {displayMessage}
      </div>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">login</button>
    </form>      
  )


  const blogForm = () => (  
    <div>
      <h2>blogs</h2>
      <div className = {messageClass}>
        {displayMessage}
      </div>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm
          createBlog = {handleCreateBlog}
        />
      </Togglable>
      {blogs.map(
        blog =>
          <Blog 
            key={blog.id} 
            blog={blog} 
            handleAddLike = {handleAddLike}
            loggedInUser = {user}
            handleRemoveBlog = {handleRemoveBlog}  
          />
       )}
    </div>
  )
    

  if (user === null) {
    return loginForm()
  }
  return blogForm()
}

export default App