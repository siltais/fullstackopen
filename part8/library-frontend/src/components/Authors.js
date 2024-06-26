import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthyear from '../components/SetBirthyear'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const authors = result.data.allAuthors

  const chkLogin = () => {
    if(props.token && authors.length > 0){
      return <SetBirthyear authors={authors} />
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {chkLogin()}
    </div>
  )
}

export default Authors
