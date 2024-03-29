
import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleCreateBlog = (event) => {
    event.preventDefault()
    try{
      createBlog({
        title: title,
        author: author,
        url: url
      })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <form onSubmit={handleCreateBlog}>
      <h2>create new</h2>
      <div>
        title:
        <input
          data-testid="title"
          className="inputTitle"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          data-testid="author"
          className="inputAuthor"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          data-testid="url"
          className="inputUrl"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default NewBlogForm