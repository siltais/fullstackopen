import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [msg, setMsg] = useState(null)
  const [newBook, setNewBook] = useState([])
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      window.alert(`New book added. \n${data.data.bookAdded.title} by ${data.data.bookAdded.author.name}`)
      client.refetchQueries({
        include: [ALL_BOOKS, ALL_AUTHORS],
      })

      if(data.data.bookAdded.genres) {
        data.data.bookAdded.genres.forEach(genre => {
          client.cache.evict({
            id: "ROOT_QUERY",
            fieldName: "allBooks",
            args: { genre: genre },
          })          
        })
       } 
      }
    }
  )

  const chkLogin = () => {
    if(!token) {
      return (
        <span>
          <button onClick={() => setPage('login')}>login</button>
       </span>
      )
    } else {
      return (
        <span>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={() => logout()}>logout</button>
        </span>
      )
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const displayMsg = (message) => {
    setMsg(message)
    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>      
        {chkLogin()}
      </div>
      <div>{msg}</div>
      <Authors show={page === 'authors'} displayMsg={displayMsg} token={token}/>
      <Books show={page === 'books'} newBook={newBook} client={client} />
      <NewBook show={page === 'add'} displayMsg={displayMsg} setNewBook={setNewBook} />
      <Login show={page === 'login'} setToken={setToken} setPage={setPage} displayMsg={displayMsg} />
      <Recommend show={page === 'recommend'} />

    </div>
  )
}

export default App
