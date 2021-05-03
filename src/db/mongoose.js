const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
     useUnifiedTopology: true 
})



//Examples to save data to database using mongoose

/* const me = new User({
    name: 'Siri     ',
    email: '   Teki.Siri@gmail.com',
    password: '    sirisha '
})

me.save().then((res) => {  
  console.log(me);
}).catch((error) => {
    console.log(error)
}) */


/* const task = new Task({
    description : 'reading advanced     angular         '
})

task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log(error)
}) */