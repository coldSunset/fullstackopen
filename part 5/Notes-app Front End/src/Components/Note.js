import React from 'react'

const Note = ({note, toggleImportance}) => {
  //console.log('Contents of', note)
  const label = note.important 
    ? 'make not important' : 'make important'
  return (
      <li className='note'>
        {note.content}<button onClick={toggleImportance}>{label}</button>
      </li>
    )
  }

  export default Note