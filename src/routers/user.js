const express = require('express')
const multer =  require('multer')
const sharp =  require('sharp')
const router =  express.Router()
const User =  require('../models/user')
const auth = require('../middleware/auth')

//create users endpoint
router.post('/users', async (req,res) => {    
    try{
        const user =  new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
   
})

//Read profile endpoint
router.get('/users/me', auth, (req, res) => {
   res.send(req.user)
})

//Read all users
router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch{
        res.status(500).send()
    }   
})

//Read user with id endpoint
router.get('/user/:id', (req, res) => {
    const _id  =  req.params.id 
    User.findById(_id).then( user => {
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }).catch(e => {
        res.status(500).send(e)
    })
})

//update user endpoint
router.patch('/users/me', auth, async (req, res) => {
    const updates =  Object.keys(req.body)
    const allowedUpdates =  ['name','email', 'password', 'age']
    const isValidUpdate  = updates.every(update => allowedUpdates.includes(update))
    if(!isValidUpdate){
        res.status(400).send({e : 'Invalid update!'})
    }
try{
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:  true})
    // const user = await User.findById(req._id)
    updates.forEach(update => req.user[update] =  req.body[update])
    await req.user.save()   
    res.send(req.user)
}catch(e){
    res.status(400).send(e)
}
})

//delete user endpoint
router.delete('/users/me', auth, async (req, res) => {
    try{       
       /*  const user =  await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user) */
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
   
})

router.post('/users/login',  async (req, res) => {
    try{
      const user =  await User.findByCredentials(req.body.email, req.body.password) 
      const token =  await user.generateAuthToken();     
      res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens =  req.user.tokens.filter(token =>  req.token!== token.token)
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens =  []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    // This is for saving the images to a folder
    //dest: 'avatars',
    limits: {
        fileSize : 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Not a valid image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'),  async (req, res) => {
      const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer() 
      req.user.avatar = buffer
      await req.user.save()
      res.send()    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }
})

module.exports = router