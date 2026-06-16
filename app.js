require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const passportConfig = require('./config/passport')

passportConfig(passport)

const app = express();



//Load Routes
const auth = require('./routes/auth')

const port = process.env.PORT || 5000

app.listen(port , ()=>{
    console.log(`Server started at ${port}`)
})

app.use('/auth',auth)

app.get("/",(req,res) =>{
    res.send('It Works')
})