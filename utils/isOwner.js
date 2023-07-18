const Gym = require('../models/gym');

module.exports = async (req, res, next) => {
    const gym = await Gym.findById(req.params.id);
    if (!gym.owner.equals(req.user._id)) {
        req.flash('error', 'Unauthorized action!');
        return res.redirect(`/gyms/${req.params.id}`);
    }
    next();
}