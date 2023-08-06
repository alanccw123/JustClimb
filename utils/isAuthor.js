const Review = require('../models/review');

module.exports = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewid);
    if (!review) {
        throw new AppError('Review not found', 404)
      }
    if (!review.author.equals(req.user._id) && !req.user.isAdmin) {
        req.flash('error', 'Unauthorized action!');
        return res.status(403).redirect(`/gyms/${req.params.id}`);
    }
    next();
}