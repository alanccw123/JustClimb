const express = require('express');
const router = express.Router({mergeParams: true});
const Gym = require('../models/gym');
const Booking = require('../models/booking');
const loginRequired = require('../utils/loginRequired');
const { route } = require('express/lib/router');

router.post('/new', async(req, res) =>{
    if (!req.isAuthenticated()) {
        return res.status(401).json('/login')
    }
    
    const {gym_id, date, quantity} = req.body;
    const gym = await Gym.findById(gym_id)
    if (!gym) {
        return res.json('gym not found')
    }
    const booking = new Booking({
        totalPrice: quantity * gym.price,
        quantity: quantity,
        date: date,
        buyer: req.user._id,
        gym: gym_id
    });
    await booking.save()
    res.json('ok')
})


module.exports = router;