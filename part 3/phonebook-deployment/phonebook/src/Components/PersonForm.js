import React from 'react'

const PersonForm = (props) => {
    
    const {insertName,newName,handleNameChange,handleNumberChange,newNumber} = props
    console.log(newName)
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

  export default PersonForm