const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', async(req, res) => {
    res.render('auth/register');
})

router.post('/register', async(req, res) => {
    const {username, password} = req.body;
    await User.register({username}, password);
    res.redirect('/gyms')
})

router.get('/login', async(req,res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
(req,res) => {
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