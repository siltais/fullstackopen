import { useState } from 'react'
const Blog = ({ blog, handleAddLike, loggedInUser, handleRemoveBlog }) => {
  const [blogVisible, setBlogVisible] = useState('')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const displayRemoveButton = (userNameLoggedIn, blog) => {
    if(userNameLoggedIn === blog.user.username){
      return <div><button onClick={() => handleRemoveBlog(blog)}>Remove</button></div>
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style = {hideWhenVisible} onClick={() => setBlogVisible(true)}>view</button>
        <button style = {showWhenVisible} onClick={() => setBlogVisible(false)}>hide</button>
        <div className='hiddenInBlog' style = {showWhenVisible}>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
          <button onClick={() => handleAddLike(blog)}>like</button><br />
          </div>
          {blog.user.name}
          {displayRemoveButton(loggedInUser.username, blog)}
        </div>
      </div>
    </div>
  )
}
export default Blog