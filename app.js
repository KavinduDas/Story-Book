require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const passportConfig = require('./config/passport')
const session = require('express-session')  
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const { engine } = require('express-handlebars')


const app = express()

app.use(cookieParser())
app.use(session({
    secret:  'secret',
    resave: false,
    saveUninitialized: false
}))

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method Override
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

// Set Global variables 
app.use((req,res,next)=>{
    res.locals.user = req.user ? req.user.toObject() : null
    next()
})
// load routes 
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

// Load User model
// require('./models/user')
passportConfig(passport)

//Load Keys 
const keys =  require('./config/keys')

// Handlebar helpers 
const {
    truncate ,
    stripTags ,
    formatdate ,
    select ,
    editIcon
} = require('./helpers/hbs')

// Map Global Promises 
mongoose.Promise = global.Promise

// Mongoose Connect 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

// Handlebars Middleware 

app.engine('handlebars', engine({
    helpers :{
        truncate : truncate,
        stripTags : stripTags,
        formatdate : formatdate,
        select : select ,
        editIcon : editIcon
    },
    defaultLayout: 'main'
}))
app.use('/auth',auth)
app.use('/',index)
app.use('/stories',stories)

// Set Static folder 
app.use(express.static(path.join(__dirname ,'public')))

app.set('view engine' , 'handlebars')

const port = process.env.PORT || 5000

app.listen(port , ()=>{
    console.log(`Server started at ${port}`)
})

