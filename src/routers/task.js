const express = require('express')
const router = express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

//create tasks endpoint
router.post('/tasks', auth, async (req,res) => {
    const task =  new Task({...req.body, owner: req.user._id})
    try{        
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
 
})

//Read tasks endpoint
// tasks?completed=true : these query params are used for filtering the data
// tasks?limit=2&skip=1 : these are for pagination
// tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed ===  'true'
    }
    if(req.query.sortBy){
        const parts =  req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'asc') ? 1 : -1
    }

   try{
    //const tasks =  await Task.find({owner: req.user._id})
    // we can also try the other way down
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit : parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.send(req.user.tasks)
   }catch(e){
       console.log(e)
    res.status(500).send(e)
   }
})

//Read task endpoint
router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner : req.user._id})  
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }  
})

//update task endpoint
router.patch('/task/:id', auth, async (req, res) => {
    const updates =  Object.keys(req.body)
    const allowedUpdates =  ['description','completed']
    const isValidUpdate  = updates.every(update => allowedUpdates.includes(update))
    if(!isValidUpdate){
        res.status(400).send({e : 'Invalid update!'})
    }
try{
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:  true})
    //const task = await Task.findById(req.params.id)
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task){
        res.status(404).send();
    }
    updates.forEach(update => task[update] =  req.body[update])
    await task.save()   
    res.send(task)
}catch(e){
    res.status(400).send(e)
}
})

//delete task endpoint
router.delete('/task/:id', auth, async (req, res) => {
    try{
        //const task =  await Task.findByIdAndDelete(req.params.id)
        const task =  await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
        await task.remove()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
      
})

module.exports =  router