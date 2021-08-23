import React, { useState } from 'react'

const App=() => {
  const [persons, setPersons] = useState([
    {name: 'Eric Blair'}
  ])

  const [newName, setNewName] = useState('')

  const insertName = (event) => {
    event.prevent.Default()
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name:<input/>
        </div>
        <div>
        <button type='submit'>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>debug: {newName}</div>
    </div>
  )
}

export default App;
