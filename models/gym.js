const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    image: String
});

module.exports = mongoose.model('Gym', gymSchema);