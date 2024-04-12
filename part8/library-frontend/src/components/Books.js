import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (genreFilter) {
      filteredBooks.filter(b => b.genres.includes(genreFilter))
    }
  }, [genreFilter])

  
  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }


  let filteredBooks = []
  if(genreFilter){ 
    filteredBooks = result.data.allBooks.filter(
      b => b.genres.includes(genreFilter)
    )
  }
  else {
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
