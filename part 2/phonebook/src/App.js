import React, { useState } from 'react'

const App=() => {
  const [persons, setPersons] = useState([
    { name: 'Eric Blair', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState([])


  const Person = ({person}) => {
    return (
      <div>{person.name} {person.number}</div>
    )
  }

  const insertName = (event) => {
    event.preventDefault()
    const people = persons.map(p=>(p.name))
    if(people.indexOf(newName) === -1){
    const newPerson= {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
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
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <p>
        filter shown with<input/></p>
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
      <h2>Numbers</h2>
      <div>
        {persons.map(person=><Person key={person.name} person={person}/>)}
      </div>
      <div><strong>debug: {newName} {newNumber}</strong></div>
    </div>
  )
}

export default App;
