const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    image: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId,
        ref: "review"}]
});

module.exports = mongoose.model('Gym', gymSchema);