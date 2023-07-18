const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: Number,
    author: { type: mongoose.Schema.Types.ObjectId,
        ref: "user"}
}, {timestamps: true});

module.exports = mongoose.model('review', reviewSchema);