import React, {useEffect, useState} from 'react'
import Note from './Compoents/Note'
import axios from 'axios'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() =>{
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  },[])

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n=> n.id === id)  
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
  }

  //console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    if(!(newNote.trim()=="")){
    const noteObject = {
      content: newNote, 
      date: new Date().toISOString(), 
      important: Math.random() < 0.5, 
      //id: notes.length + 1,
    }
    noteService
      .create(noteObject)
      .then(response=> {
        setNotes(notes.concat(noteObject))
        setNewNote('')
      })
    
  }
  else{
    alert("You must insert text")
  }
  }

  const handleNoteChange = (event) => {
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note=> note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important':'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note,i)=>
           <Note 
            key={i} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} 
            />
             )}
      </ul>
      <form onSubmit={addNote}>
        <input 
        value = {newNote}
        onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App;