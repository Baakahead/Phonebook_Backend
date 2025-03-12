const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
let persons =
    [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

const generateId = () =>{
    const maxID= persons.length>0 ? Math.max(...persons.map(p => Number(p.id))) : 0
    const max=2000
    const minCeiled=Math.ceil(maxID)
    const maxFloored=Math.floor(max)
    return String(Math.floor(Math.random()*(maxFloored-minCeiled)+minCeiled))
}
const formatTime = (number) => {
    return number < 10 ? '0' + number : number
}
app.get('/api/persons', (request, response) => {
    Person.find({}).then(p => {
        response.json(p)
    })
})

app.get('/info', (request, response,next) => {
    const days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')
    const months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    const date = new Date()
    const day = days[date.getDay()]
    const month = months[date.getMonth()]
    const currentDate = date.getDate()
    const year = date.getFullYear()
    const hours = formatTime(date.getHours())
    const minutes = formatTime(date.getMinutes())
    const seconds = formatTime(date.getSeconds())
    const zone = date.getTimezoneOffset()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    Person.find({})
        .then(result =>{
            response.send(`
                <div>
                    <p>Phonebook has info of ${result.length} people</p>
                </div>
                <div>
                    <p>${day} ${month} ${currentDate} ${year} ${hours}:${minutes}:${seconds} GMT${zone} (${timeZone} Standard time)</p>
                </div>`
            )
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(p =>{
        if(p)
        response.json(p)
        else
        response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response,next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons',(request,response,next) => {
    const body=request.body
    if(!body.name || !body.number)
    {
        response.status(400).json({ error: 'name or number is missing' 
        })
        console.log('name or number missing');
        
    }
    else{
        const person = new Person({
            name: body.name,
            number:body.number,
        })
        person.save().then(p =>{
            response.json(p)
        })
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} =request.body
    Person.findByIdAndUpdate(request.params.id,{name,number},{new: true, runValidators: true, context: 'query'})
        .then(updatedPerson =>{
            if(updatedPerson){
                response.json(updatedPerson)
            }
            else{
            response.status(404).end()}
        })
        .catch(error => next(error))
    })

const errorHandler = (error, request, response, next) =>{
    console.error(error.message)
    if(error.name==='CastError')
    {
       return response.status(400).send({error: 'Malformed id'})
    }
    else if(error.name==='ValidationError')
    {
         return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
