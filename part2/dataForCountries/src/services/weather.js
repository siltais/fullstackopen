import axios from 'axios'


const getWeather = (lat, lng) => {
    const request = axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=ms&forecast_days=1`)
    return request.then(response => response.data)
}

export default { getWeather }