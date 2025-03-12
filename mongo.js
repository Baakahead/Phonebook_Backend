const mongoose=require('mongoose')

if(process.argv.length<3)
{
    console.log('Password required');
    process.exit()
}

const password=process.argv[2]

const url=`mongodb+srv://vaidyaaashwin23:${password}@cluster0.x1tsb.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema= new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)

const Person = mongoose.model('Person',personSchema)

const person=new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if(process.argv.length===3)
{
    Person.find({}).then(result =>{
        console.log('Phonebook:');
        
        result.forEach(p =>
            {
                console.log(`${p.name} ${p.number}`);
            }
        )
        mongoose.connection.close()
    })
}
else{
    person.save().then(result =>{
        console.log('Person saved');
        mongoose.connection.close()
    })
}
