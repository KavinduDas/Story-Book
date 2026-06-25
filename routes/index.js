
const express = require('express')
const router = express.Router()

router.get("/",(req,res) =>{
    res.render('index/welcome')
})

router.get("/dashboard",(req,res) =>{
    console.log('User in session:', req.user)
    res.send('Dashboard')
})

module.exports = router