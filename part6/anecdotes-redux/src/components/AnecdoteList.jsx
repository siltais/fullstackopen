import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(
    state => state.anecdotes.filter(
      anecdote => 
      anecdote
      .content
      .toLowerCase()
      .includes(state.filter)
    ))

  
    
  const vote = (id) => { 
    const votedAnecdote = anecdotes.find(
      anecdote => anecdote.id === id
    )
    dispatch(voteAnecdote(id))
    dispatch(
      displayNotification(`you voted '${votedAnecdote.content}'`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return(
    <div>
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
    </div>
  )
}

export default AnecdoteList