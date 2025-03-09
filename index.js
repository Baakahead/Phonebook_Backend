const express = require('express')
const morgan = require('morgan')
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
    response.json(persons)
})

app.get('/info', (request, response) => {
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
    response.send(`
        <div>
            <p>Phonebook has info of ${persons.length} people</p>
        </div>
        <div>
            <p>${day} ${month} ${currentDate} ${year} ${hours}:${minutes}:${seconds} GMT${zone} (${timeZone} Standard time)</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {

    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        return response.status(200).json(person)
    }
    console.log("Person not found")
    return response.status(404).json({ message: "id not found" })

})

app.delete('/api/persons/:id', (request,response) => {
    const id= request.params.id
    persons=persons.filter(p => p.id!=id)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body=request.body
    if(!body.name || !body.number)
    {
        response.status(400).json({ error: 'name or number is missing' 
        })
        console.log('name or number missing');
        
    }
    if(persons.find(p => p.name===body.name))
    {
        response.status(400).json({
            error: `${body.name} is already added in the phonebook`
        })
        console.log('Already exists')
    }
    const person = {
        name: body.name,
        number:body.number,
        id: generateId(),
    }
    persons=persons.concat(person)
    response.json(person)
})
const PORT = process.env.PORT||3001
app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`)
})
