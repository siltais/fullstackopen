const Country = ({countries, showSingleCountry}) =>{
    if(countries === null){
      return(
        <></>
      )
    }
    if(countries.length > 10){
      return(
        <div>
          Too many matches, specify another filter
        </div>
      )
    }
    if(countries.length < 10 && countries.length > 1){
      return(
        <div>
          {countries.map( 
            country =>
              <div key = {country.flag}>
                {country.name.common} 
              <button 
                onClick = {() => showSingleCountry(country.name.common)}>
                show 
              </button>
              </div>
          )}
      </div>
    )}
    if(countries.length === 1){
      return(
        <div>
          { 
            countries.map( 
            country =>
            <div key = {country.flag}>       
              <h1>{country.name.common}</h1>
              <div>capital {country.capital}</div>
              <div>area {country.area}</div>
              <h3>languages</h3>
              {Object.entries(country.languages)
              .map(([key, value]) => 
              (
                <li key={key}>{value}</li>
              ))}
              <br />
              <img src={country.flags.png} width = "150" />       
            </div>       
            )         
          }    
        </div>
      )    
    }
  }

  export default Country