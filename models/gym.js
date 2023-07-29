const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "review"
  }]
}, {timestamps: true});

gymSchema.index({ location: "2dsphere" });
gymSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Gym', gymSchema);