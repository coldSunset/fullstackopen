import React, {useEffect, useState} from 'react'
import PersonForm from './Components/PersonForm'
import Filter from './Components/Filter'
import Person from './Components/Person'
import phoneService from './services/phonebook'
import Notification from './Components/Notification'

const App=() => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [search, setSearch ] = useState(false)
  const [filterArray, setFilterArray] = useState(persons.map(person=>person.name))
  const [errorMessage, setErrorMessage] = useState(null)

useEffect(() => {
  //console.log('effect 1')
  phoneService
    .getAll()
    .then(InitialPersons=>{
      //console.log('promised fulfilled')
      setPersons(InitialPersons)
    })
}, [])

  //console.log('render', persons.length, 'persons')

  // event handlers 

  const insertName = (event) => {
    event.preventDefault()
    const people = persons.map(p=>(p.name))
    if(people.indexOf(newName) === -1){
    const newPerson= {
      name: newName,
      number: newNumber
    }
    
    phoneService
    .create(newPerson)
    .then(returnedPerson=> {
      setPersons(persons.concat(returnedPerson))
      setErrorMessage(`Added ${returnedPerson.name}`)
        setTimeout(() =>{
          setErrorMessage(null)
        }, 3000)
      setNewName('')
      setNewNumber('')
    })
    }
    else if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      const newPerson= {
        name: newName,
        number: newNumber,
        id: (persons.find(p => p.name === newName).id)
      }
      console.log(newPerson)
     phoneService
      .update(newPerson.id,newPerson)
      .then(returnedData =>{
        const adPersons = persons.filter(p=>p.id!==returnedData.id)
        setPersons(adPersons.concat(returnedData))
        setErrorMessage(`Updated ${returnedData.name}`)
        setTimeout(() =>{
          setErrorMessage(null)
        }, 3000)
        setNewName('')
        setNewNumber('')
        })
        .catch(error => {
          console.log('fail')
          setErrorMessage(`[ERROR] Information of ${newPerson.name} has already been removed from server`)
          setTimeout(() =>{
            setErrorMessage(null)
          }, 3000)
        setNewName('')
        setNewNumber('')
        })
    }
  }

  const handleNameChange= (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) =>{
    //console.log(event.target.value)
    setNewNumber(event.target.value)

  }

  const deleteHandler = (event) => {
    const delName = persons.find(p => p.id == event.target.id)
    if(window.confirm(`Delete ${delName.name} ?`))
    {
      phoneService
       .deletePer(delName.id)
       .then(
        setPersons(persons.filter(p=>p.id != delName.id))
      )
    }
  }

  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
    if(event.target.value !==""){
    setSearch(true)
    const filter= event.target.value
    const people=persons.map(person=>person.name)
    //console.log('new people array',people.filter(str=>str.includes(filter)))
    setFilterArray(people.filter(str=>str.includes(filter)))
  }
  else{
    setSearch(false)
    setFilterArray(persons.map(person=>person.name))
  }
  //console.log('State of filter',filterArray)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter newFilter={newFilter}
              handleFilterChange= {handleFilterChange}
              />

      <h3>Add a new</h3>

      <PersonForm insertName={insertName} 
                  newName={newName}
                  handleNumberChange={handleNumberChange}
                  newNumber={newNumber}
                  handleNameChange={handleNameChange}
                  />

      <h3>Numbers</h3>
      
      <div>
        <Person persons={persons}
                search={search}
                filterArray={filterArray}
                deleteHandler={deleteHandler}/>
      </div>
      <div><strong>debug: {newName} {newNumber}</strong></div>
    </div>
  )
}

export default App;