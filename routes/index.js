const { ensureAuthenticated } = require('../helpers/auth')
const express = require('express')
const router = express.Router()
const Story = require('../models/story')

router.get("/",(req,res) =>{
    res.render('index/welcome')
})

router.get("/dashboard",ensureAuthenticated ,(req,res) =>{
    Story.find({user: req.user.id})
    .lean()
    .then(stories =>{
         res.render('index/dashboard' , {
            stories : stories
         })
    })
   
})

router.get("/about",(req,res) =>{ 
    res.render('index/about')
})

module.exports = router