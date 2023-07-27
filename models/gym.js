const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId,
        ref: "user"},
    reviews: [{ type: mongoose.Schema.Types.ObjectId,
        ref: "review"}]
});

gymSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Gym', gymSchema);