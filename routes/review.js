const express = require('express');
const router = express.Router({mergeParams: true});
const Gym = require('../models/gym');
const Review = require('../models/review');
const loginRequired = require('../utils/loginRequired');


router.post('/', loginRequired, async (req, res) => {
    const review = new Review(req.body.review)
    const gym = await Gym.findById(req.params.id)
    gym.reviews.push(review)
    await review.save()
    await gym.save()
    res.redirect(`/gyms/${req.params.id}`)
})

router.delete('/:reviewid',loginRequired, async(req, res) => {
    console.log("delete")
    await Review.findByIdAndDelete(req.params.reviewid);
    await Gym.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewid} });
    res.redirect(`/gyms/${req.params.id}`);
})

module.exports = router;