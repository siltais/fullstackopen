import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthyear = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [msg, setMsg] = useState('')

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log(messages)
    }
  })


  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
        setMsg('Author not found')
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({  variables: { name, year } })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>set birtyears</h2>
      <div style={{color: "red"}}>{msg}</div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={year}
            onChange={({ target }) => setYear(parseInt(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthyear