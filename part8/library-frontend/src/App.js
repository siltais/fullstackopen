import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [msg, setMsg] = useState(null)
  const client = useApolloClient()


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
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} displayMsg={displayMsg} />
      <Login show={page === 'login'} setToken={setToken} setPage={setPage} displayMsg={displayMsg} />
      <Recommend show={page === 'recommend'} />

    </div>
  )
}

export default App
