import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const result = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME)
  
  if (!props.show) {
    return null
  }
  if (result.loading || meResult.loading)  {
    return <div>loading...</div>
  }
 
  const favGenre = meResult.data.me.favoriteGenre
  const books = result.data.allBooks.filter(b => b.genres.includes(favGenre))

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{favGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published !== 0 ? a.published : 'unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
