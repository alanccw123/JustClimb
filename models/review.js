const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        required: [true, 'A rating is required']
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Author id is required']
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);