const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId,
        ref: "user"},
    reviews: [{ type: mongoose.Schema.Types.ObjectId,
        ref: "review"}]
});

module.exports = mongoose.model('Gym', gymSchema);