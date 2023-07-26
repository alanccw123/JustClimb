const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', async(req, res) => {
    res.render('auth/register');
})

router.post('/register', async(req, res) => {
    const newUser = new User({username: req.body.username})
    if (req.body.owner) {
        newUser.isOwner = true;
    }
    if(req.body.username === process.env.default_admin){
        newUser.isAdmin = true;
    }
    await User.register(newUser, req.body.password);
    
    res.redirect('/gyms')
})

router.get('/login', async(req,res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
(req,res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/gyms');
})

router.get('/logout', function(req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('gyms');
    });

});



module.exports = router;