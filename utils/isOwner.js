const Gym = require('../models/gym');

module.exports = async (req, res, next) => {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
        throw new AppError('Gym not found', 404)
      }
    if (!gym.owner.equals(req.user._id) && !req.user.isAdmin) {
        req.flash('error', 'Unauthorized action!');
        return res.status(403).redirect(`/gyms/${req.params.id}`);
    }
    next();
}