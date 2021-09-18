const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ravUser:${password}@cluster0.tr4kn.mongodb.net/note-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected ..."))
    .catch(err => console.log(err));  

const noteSchema = new mongoose.Schema({
    content: String, 
    date: Date, 
    important:Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/* const note = new Note({
    content: 'Callback-functions suck', 
    date: new Date(), 
    important: true, 
})

note.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close() 
}) */

Note.find({important:true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close() 
})