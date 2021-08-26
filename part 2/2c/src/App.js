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
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  },[])

  const toggleImportanceOf = id => {
    //const url = `http://localhost:3001/notes/${id}`
    const url = `http://192.168.1.110:3001/notes/${id}`
    const note = notes.find(n=> n.id === id)  
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
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
      .then(returnedNote=> {
        setNotes(notes.concat(returnedNote))
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