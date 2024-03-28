import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useMessageDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useMessageDispatch()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      dispatch({ type: "DISPLAY_MESSAGE", msg:`too short anecdote, must have length 5 or more` })
      setTimeout(() => {
        dispatch({ type: "CLEAR_MESSAGE"})
      }, 5000) 
    } 
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch({ type: "DISPLAY_MESSAGE", msg:`anecdote '${content}' created` })
    setTimeout(() => {
      dispatch({ type: "CLEAR_MESSAGE"})
    }, 5000) 
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
