
const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google',
    {scope : ['profile','email']}
))

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

  router.get('/verify', (req, res)=>{
    if(req.user){
        console.log(req.user)
    }else{
        console.log('Not User')
    }
  })


  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) { return next(err) }
        res.redirect('/')
    })
})


module.exports = router