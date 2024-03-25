import AnecdoteForm from './components/AnecdoteForm'
import { voteAnecdote } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'



const App = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)


  const vote = (id) => {
    dispatch(voteAnecdote(id))
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
    <AnecdoteForm />
    </div>
  )
}

export default App