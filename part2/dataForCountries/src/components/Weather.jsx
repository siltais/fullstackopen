const Weather = ({capital, weather}) => {
    if(capital === null){
      return (
        <></>
      )
    }else if(weather != null){
      return (
        <>
          <h2>Weather in {capital}</h2>
          <div>temperature {weather.current.temperature_2m} Celsius</div>
          <div>wind {weather.current.wind_speed_10m} m/s</div>
          <div>weather code {weather.current.weather_code} (open-meteo.com does not provide weather icons. Could implement local)</div>
        </>
      )
    }
  }

  export default Weather