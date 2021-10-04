import React, {useEffect, useState, useRef} from 'react'
import Note from './Components/Note'
import Notification from './Components/Notification'
import LoginForm from './Components/LoginForm'
import NoteForm from './Components/NoteForm'
import Togglable from './Components/Togglable'
import Footer from './Components/Footer'
import noteService from './services/notes'
import loginService from './services/login'


const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMesssage] = useState(null)

  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  },[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)

    }
    catch (exception) {
      setErrorMesssage('wrong credentials')
      setTimeout(() => {
        setErrorMesssage(null)
      }, 5000)
    }
  }



  const toggleImportanceOf = id => {
    const note = notes.find( n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      console.log("the returned note",returnedNote)
    })
    .catch(error=> {
      console.log('error message',error)
      setErrorMesssage(
        `Note '${note.content}' was already deleted from server`
      )
      setTimeout(() => {
        setErrorMesssage(null)
      },5000)
      setNotes(notes.filter(n=> n.id !== id))
    })
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note=> note.important === true)

  

  const loginForm = () => (
        <Togglable buttonLabel="login">
          <LoginForm
              handleSubmit={handleLogin} 
              />
          </Togglable>
  )

 

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm
      createNote={addNote}
      />
    </Togglable>
    
  )
  

  return (
    <div>
      <h1>Notes</h1>
      <Notification message = {errorMessage}/> 
      
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
          </div>
      }

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
      <Footer />
    </div>
  )
}

export default App;