import { useState } from 'react'
const Blog = ({ blog, handleAddLike }) => {
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
  
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
          <button style = {hideWhenVisible} onClick={() => setBlogVisible(true)}>view</button>
          <button style = {showWhenVisible} onClick={() => setBlogVisible(false)}>hide</button>
        <div style = {showWhenVisible}>
          {blog.url}<br />
          likes {blog.likes}
          <button onClick={() => handleAddLike(blog)}>like</button><br /> 
          {blog.user.name}
          <br />      
        </div>
     
      </div>
    </div>  
  )
}
export default Blog