const Review = require('../models/review');

module.exports = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewid);
    if (!review.author.equals(req.user._id) && !req.user.isAdmin) {
        req.flash('error', 'Unauthorized action!');
        return res.redirect(`/gyms/${req.params.id}`);
    }
    next();
}