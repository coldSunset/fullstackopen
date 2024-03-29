require('dotenv').config() 

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')  
const Note = require('./models/note')

const app = express() 
app.use(express.json())
app.use(cors())



/* let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ] */

  app.use(morgan((tokens,request,response)=>{
    return[
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)]
        .join(' ')
}))

/* const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
} */

//app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!<h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Notes.findById(request.params.id).then(note =>{
      response.json(note)
    })
    
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
   const body = request.body 
  
   if(body.content === undefined){
     return response.status(400).json({
       error: 'content missing'
     })
   }

  const note = new Note({
    content : body.content, 
    important : body.important || false, 
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => notes.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})