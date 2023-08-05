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
    req.login(newUseruser, function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have created a new account!')
        return res.redirect('/gyms');
      });
})

router.get('/login', async(req,res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }), 
(req,res) => {
    const redirectTo = req.session.redirectTo || '';
    delete req.session.redirectTo;
    req.flash('success', 'Welcome back!');
    console.log(redirectTo);
    res.redirect('/gyms/' + redirectTo);
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