const express = require('express');
const router = express.Router();
const Gym = require('../models/gym');
const Review = require('../models/review')

// gym routes
router.get('/new', async(req, res) => {
    res.render('gym/newgym');
})

router.post('/new', async(req, res) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    req.flash('success', 'Your gym has been added');
    res.redirect('/gyms');
})

router.get('/:id', async (req, res) => {
    const gym = await Gym.findById({_id: req.params.id}).populate('reviews');
    res.render('gym/gym', {gym});
})

router.get('/', async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gym/gyms', {gyms});
}) 

router.get('/:id/edit', async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    res.render('gym/edit', {gym});
})

router.put('/:id/edit', async (req, res) => {
    const gym = await Gym.updateOne({_id: req.params.id}, req.body.gym);
    req.flash('success', 'Changed saved');
    res.redirect(`/gyms/${req.params.id}`)
})

router.delete('/:id/delete', async (req, res) => {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    await Review.deleteMany({_id : {$in : gym.reviews}})
    req.flash('success', 'Your gym has been deleted');
    res.redirect('/gyms')
})


module.exports = router;