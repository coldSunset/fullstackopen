const {request, response} = require('express')
const express = require('express')
//const { token } = require('morgan')
const app = express() 
const morgan = require('morgan')

app.use(express.json())


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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

/* const requestLogger = (request, response, next) => {
    console.log('name:', response.name)
    console.log('number:  ', response.number)
    console.log('---')
    next()
} */


app.get('/api/persons', (request,response) =>{
    response.json(persons)
})

app.get('/info', (request,response) =>{
    response.send(`
    <div>Phonebook has info for ${persons.length}</div>
    <p>${new Date()}</p>
    `)
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id ===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end() 
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
     persons = persons.filter(p =>{ p.id !==id;console.log(p)})

     response.status(204).end()
})

const generateId = () => {
    let maxId = persons.length 
    maxId += Math.floor(maxId+Math.random()*100)
    console.log('print max id',maxId)
    return maxId
}

app.post('/api/persons', (request,response) => {
    const body = request.body
    if(!body.name || !body.number){
        let val = !body.name ? 'name' : 'number'
        return (
            response.status(400).json({
            error: `${val} is missing`
        }))
    }

    const person = {
        name: body.name, 
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)
    response.json(person)

})

const PORT = 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
