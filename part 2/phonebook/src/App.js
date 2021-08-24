import React, {useEffect, useState} from 'react'
import axios from 'axios'

const App=() => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [search, setSearch ] = useState(false)
  const [filterArray, setFilterArray] = useState(persons.map(person=>person.name))

useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/persons')
    .then(response=>{
      console.log('promised fulfilled')
      setPersons(response.data)
    })
}, [])

  console.log('render', persons.length, 'persons')

  const Contacts = ({person}) => {

    return(
      <div>{person.name} {person.number}</div>
    )
  }

  const Person = ({persons}) => {
    if(search){
    persons = persons.filter(per=>filterArray.includes(per.name))
    }
    return (
      persons.map(person=><Contacts key={person.name} person={person}/>)
    )
  }

  const PersonForm = () => {

    return(
      <form onSubmit={insertName}>
      <div>
        name:<input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value = {newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
      <button type='submit'>add</button>
      </div>
    </form>
    )
  }

  const Filter = () => {

    return(
      <p>
      filter shown with<input value={newFilter} onChange={handleFilterChange}/>
    </p>
    )
  }

  // event handlers 

  const insertName = (event) => {
    event.preventDefault()
    const people = persons.map(p=>(p.name))
    if(people.indexOf(newName) === -1){
    const newPerson= {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setFilterArray(persons.map(person=>person.name))
    console.log('check new', persons)
    setNewName('')
    setNewNumber('')
    }
    else{
      alert(`${newName} is already added to phonebook`)
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
  console.log('State of filter',filterArray)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <p>
      filter shown with<input value={newFilter} onChange={handleFilterChange}/>
    </p>

      <h3>Add a new</h3>

      <form onSubmit={insertName}>
      <div>
        name:<input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value = {newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
      <button type='submit'>add</button>
      </div>
    </form>

      <h3>Numbers</h3>
      
      <div>
        <Person persons={persons}/>
      </div>
      <div><strong>debug: {newName} {newNumber}</strong></div>
    </div>
  )
}

export default App;