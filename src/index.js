const express =  require('express')
require('./db/mongoose.js')
const User =  require('./models/user.js')
const Task  = require('./models/tasks')
const userRouter =  require('./routers/user')
const taskRouter = require('./routers/task')

const app =  express()
const port =  process.env.PORT || 3000
//setting up the moddleware globally for all routes
/* app.use((req, res, next) => {
    res.status(503).send('App is currently under maintainence');
}) */
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("server is up and running in port " + port)
})