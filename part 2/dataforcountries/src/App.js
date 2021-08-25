import axios from 'axios'
import React, {useEffect, useState} from 'react'

const App = () => {
  
  const [newCountry, setNewCountry] = useState('')
  //dummmy data
  const [countryList, setCountryList] = useState([])
   
  console.log(countryList)
  const [filterList, setFilteredList] = useState(countryList
                                                  .map(country=>
                                                        country.name))
  const [dispState, setDispState]     = useState(0)

  useEffect(() =>{
  console.log('effect')
  axios
    .get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      console.log('promise fulfilled')
      setCountryList(response.data)
    })
  },[]) 


  const buttonHandler = (event) =>{
    console.log("BUTTON CLICKED", event.target.id)
    setNewCountry(event.target.id)
    setDispState(3)
    const filter = event.target.id
    const countries = countryList.map(country=>country.name)
    //console.log('Filtered list', countries.filter(str=>str.includes(filter)))
    setFilteredList(countries.filter(str=>str.includes(filter)))
  }

  const DisplayLanguages = ({language}) => {
    return(
      <li>{language}</li>
    )
  }

  const ShowDetails = ({thisCountry}) => {
    const [weather, setWeather] = useState([])

    useEffect(() => {
      const params = {
        access_key: "a47a543ccdfee987452a557101e17e41",
        query: thisCountry.capital
      }
    
    axios.get('http://api.weatherstack.com/current', {params})
    .then(response => {
      const apiResponse = response.data; 
      console.log(apiResponse)
      console.log(`Current temperature in ${apiResponse.location.name}
      is ${apiResponse.current.temperature}C`); 
      setWeather([apiResponse])
    }).catch(error=>{
        console.log(error); 
    })
    },[])
    if(weather.length >0){
      const weatherStack = weather[0]
          return(<div>
      <h1><strong>{thisCountry.name}</strong></h1>
      <p>
        capital {thisCountry.capital}<br></br>
        population {thisCountry.population}
        </p>
        <h2>languages</h2>
    {thisCountry.languages.map(lang=><DisplayLanguages key={lang.name} language={lang.name}/>)}
        <br></br>
        <img src={thisCountry.flag}
            alt= "flag of country"
            width="150" height="80"
        />
        <h2>Weather in {thisCountry.capital}</h2>
        <p>
          <div><strong>temperature:</strong>{weatherStack.current.temperature} Celcius</div>
          <img src={weatherStack.current.weather_icons}
            alt= "icon"
            width="50" height="50"
        /> <br></br>
        <strong>wind:</strong> {weatherStack.current.wind_speed} mph 
                direction {weatherStack.current.wind_dir} 
        </p>
    </div>
  )
    }
    return(
      <div>
      <h1><strong>{thisCountry.name}</strong></h1>
      <p>
        capital {thisCountry.capital}<br></br>
        population {thisCountry.population}
        </p>
        <h2>languages</h2>
    {thisCountry.languages.map(lang=><DisplayLanguages key={lang.name} language={lang.name}/>)}
        <br></br>
        <img src={thisCountry.flag}
            alt= "flag of country"
            width="150" height="80"
        />
    </div>)
      

}

  const ShowCountry = ({countryName}) => {
    const filteredCountries=countryList.filter(country=>country.name==countryName)
    //console.log('filtered', filteredCountries.filter(c=>c.name == countryName))
    //console.log('countryName', countryName)
    //console.log(filteredCountries[].map(lang=>lang.languages.name))
    if(dispState == 2){
    return(
      <div>{countryName}<button id={countryName} onClick={buttonHandler} >show</button></div>
    )
  }
    if(dispState == 3){
      //const thisCountry = filteredCountries.filter(c=>c.name == countryName)
      console.log('dispstate3 ',filteredCountries)
      const thisCountry = filteredCountries[0]
      return(
        <ShowDetails thisCountry={thisCountry}/>
      )
    }
  }

  const FilterQueryTest = (event) => {
    setNewCountry(event.target.value)
    //console.log('event.target.value: ',event.target.value)
    if(!((event.target.value).trim()==""))
    {
      const filter = event.target.value
      const countries = countryList.map(country=>country.name)
      //console.log('Filtered list', countries.filter(str=>str.includes(filter)))
      setFilteredList(countries.filter(str=>str.includes(filter)))
      const filList = countries.filter(str=>str.includes(filter))
      //console.log('Length: ', filterList.length)
      if(filList.length > 10){
        setDispState(1)
      }
      else if(filList.length < 11 & filterList.length>1){
        setDispState(2)
      }
      else if(filList.length == 1){
        setDispState(3)
      }
      }
    else{
    //console.log('Empty query!')
    setFilteredList(countryList.map(country=>country.name))
    setDispState(0)
    }
    

   
  }
  const Display = ({filterList}) =>
  {
    //  there are three state: 
    //  (1) user query has more than 10 countries
    //  (2) 10 or fewer but more than 1 
    //  (3) Only 1 matching country
    //  (0) no results 
    
    if(dispState == 1){
      return(<div>Too many matches, specify another filter</div>)
    }
    else if(dispState == 2){
      return(<div>
          {filterList.map(country=><ShowCountry key={country.name} countryName={country}/>
          )}
        </div>)
    }
    else if(dispState == 3){
      return(<ShowCountry countryName = {filterList[0]}/>)
    }
    else if(dispState == 0){
      return(<div>Type to search</div>)
    }
    
  }

  console.log("Component 'App' has rendered ")
  
  return (
    <div>
      <div>
        find countries <input onChange={FilterQueryTest} 
        value={newCountry}></input>
      </div>
      <Display filterList={filterList} />

    </div>
  )
}


export default App;
