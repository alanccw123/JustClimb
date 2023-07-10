const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: Number,
}, {timestamps: true});

module.exports = mongoose.model('review', reviewSchema);