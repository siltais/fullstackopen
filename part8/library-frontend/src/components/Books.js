import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOKS_BY_GENRE} from '../queries'


const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const bookFilter = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: genreFilter },
    skip: !genreFilter,
  })

  useEffect(() => {
    if (props.newBook && genreFilter) {
      props.newBook.forEach(genre => {
        props.client.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "allBooks",
          args: { genre: genre },
          broadcast: false
        })          
      })   
    }
  }, [props.newBook])

  
  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }

  let filteredBooks = []
  if (genreFilter && bookFilter.data){
    filteredBooks = bookFilter.data.allBooks
  } else {
    filteredBooks = result.data.allBooks
  }

  

  const books = result.data.allBooks
  const setGenres = () => {
    let theGenres = []
    books.forEach(function(book) {
      book.genres.forEach(function(genre) {
        if(!theGenres.includes(genre)){
          theGenres.push(genre)
        }
      })
    })
    return theGenres
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published !== 0 ? a.published : 'unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {setGenres().map((a) => (
      <button key={a} onClick={() => setGenreFilter(a)} >
        {a}
      </button>
      ))}
      <button onClick={() => setGenreFilter(null)}>all genres</button>
    </div>
  )
}

export default Books
