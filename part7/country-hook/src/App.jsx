import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const getCountries = () => {
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if(name){
      getCountries()
      .then(response => {
        const filterCountry = response.filter(c => c.name.common.toLowerCase().includes(name))
        setCountry(filterCountry)
      })
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (country.length > 1 || country.length === 0) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country[0].name.common} </h3>
      <div>capital {country[0].capital[0]} </div>
      <div>population {country[0].population}</div> 
      <img src={country[0].flags.png} height='100' alt={country[0].flags.alt} border="1"/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App