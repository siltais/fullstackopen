import { voteAnecdote, createAnecdote } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'



const App = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)


  const vote = (id) => {
    dispatch(voteAnecdote(id))
  }

  const createNew = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={createNew}>
        <div><input name = "anecdote" /></div>
        <button type = "submit">create</button>
      </form>
    </div>
  )
}

export default App