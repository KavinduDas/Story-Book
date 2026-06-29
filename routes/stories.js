const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth')
const user = require('../models/user')
const story = require('../models/story')

router.get("/", (req,res)=>{
    story.find({ status : 'public'})
    .populate('user')
    .sort({Date : 'desc'})
    .lean()
    .then(stories =>{ 
    console.log(stories[0].user.image) 
       res.render('stories/index', {
        stories : stories
       })
    })
    
})

// Edit story 
router.get('/edit/:id' , (req,res)=>{
    story.findOne({
        _id : req.params.id
    })
    .lean()
    .then(stories => {
        if(stories.user != req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit' , {
            story : stories
        })
        }

    })
})

router.get("/add",ensureAuthenticated, (req,res)=>{
    res.render('stories/add')
})

// Process Add story 
router.post("/", ensureAuthenticated , (req,res) => {
    let allowComments ;
    if(req.body.allowComments){
        allowComments = true
    }else{
        allowComments = false;
    }
    const newStory = {
        title : req.body.title,
        status : req.body.status,
        allowComments : allowComments ,
        body : req.body.body,
        user : req.user.id
    }

    // Create story 
    new story(newStory)
    .save()
    .then(story => {
        res.redirect(`/stories/show/${story.id}`)
    })
})

// Show single stories 

router.get('/show/:id' , (req,res)=>{
    story.findOne({
        _id : req.params.id
    })
    .populate('user')
    .populate('comments.commentuser')
    .lean()
    .then(stories => {
        res.render('stories/show' , {
            story : stories
        })
    })
})

// Edit form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    story.findOne({ _id: req.params.id })
    .then(stories => {                          
        let allowComments = req.body.allowComments ? true : false

        stories.title = req.body.title
        stories.body = req.body.body
        stories.status = req.body.status
        stories.allowComments = allowComments

        stories.save()
            .then(() => res.redirect('/dashboard'))
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))             // ✅ catch added
})

// DELETE story 
router.delete('/:id',(req,res)=>{
   story.deleteOne({_id : req.params.id})
   .then(()=>{
    res.redirect("/dashboard")
   })
   .catch(err => console.log(err))
})

// Add comment 
router.post('/comment/:id', (req,res)=>{
    story.findOne({
        _id : req.params.id
    })
    .then(updateStory =>{
        const newComment = {
            commentBody : req.body.commentbody,
            commentuser : req.user.id
        }

        // Add to commenyt array
        updateStory.comments.unshift(newComment)
        updateStory.save()
        .then(newUpdatestory =>{
            res.redirect(`/stories/show/${updateStory.id}`)
        })
    })
})

// List stories from a user 
router.get("/user/:userId", (req,res)=>{
    story.find({user :req.params.userId , status:'public'})
    .populate('user')
    .lean()
    .then(stories =>{
        console.log('stories found:', stories[0]?.status)
        res.render("stories/index" , {
            stories : stories
        })
    })
})

// My stories
router.get("/my", ensureAuthenticated , (req,res)=>{
    story.find({user : req.user.id, status:'public'})
    .populate('user')
    .lean()
    .then(stories =>{
        console.log('stories found:', stories[0]?.status)
        res.render("stories/index" , {
            stories : stories
        })
    })
})

module.exports = router