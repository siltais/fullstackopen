import { useState, useEffect } from 'react'

import Weather from './components/Weather'
import Country from './components/Country'

import countryService from './services/country'
import weatherService from './services/weather'



function App() {

  const [newInput, setNewInput] = useState('') 
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState(null)
  const [weather, setWeather] = useState(null)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [capital, setCapital] = useState(null)


  useEffect(() => {
    if (filter) {
      countryService
        .getAll()
        .then(response => {
          const filtredCountries = response.filter(c => c.name.common.toLowerCase().includes(filter))
          setCountries(filtredCountries)
          if(filtredCountries.length === 1){
            fetchWeather(filtredCountries[0].capitalInfo.latlng[0], filtredCountries[0].capitalInfo.latlng[1], filtredCountries[0].capital[0])
          }else(
            setCapital(null)
          )
        })
    }
  }, [filter])

  useEffect(() => {
    if (lat && lng) {
      weatherService
        .getWeather(lat, lng)
        .then(response => {
          setWeather(response)
        })
    }
  }, [lat, lng])


  const handleInputChange = (event) => {
    setNewInput(event.target.value)
    const newFilter = event.target.value
    if(newFilter.length === 0){
      setCountries(null)
    }else{
      setFilter(newFilter)  
    }
      
  }

  const showSingleCountry = (countryToShow) => {
    setFilter(countryToShow.toLowerCase())
  }

  const fetchWeather = (lat, lng, capital) => {
    setLat(lat)
    setLng(lng)
    setCapital(capital)
  }


  return (
    <>
      <>find countries </> 
      <input 
        value={newInput} 
        onChange={handleInputChange}
      />
      <Country 
        countries = {countries}
        showSingleCountry = {showSingleCountry}
        fetchWeather = {fetchWeather}
        setLat = {setLat}
      />
      <Weather capital = {capital} lat = {lat} lng = {lng} weather = {weather} />
    </>
  )
}

export default App
