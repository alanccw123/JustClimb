const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Gym name is required']
  },
  description: String,
  price: {
    type: Number,
    require: [true, 'Price for day-pass is required']
  },
  location_string: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: [true, 'Co-ordinates are required']
    }
  },
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Owner id is required']
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  }]
}, {timestamps: true, toJSON: { virtuals: true }});

gymSchema.virtual('average_rating').get(function() {
  let total = 0;
  this.reviews.forEach((review) => total += review.rating);
  return this.reviews.length ? total / this.reviews.length : 0;
 });

gymSchema.index({ location: "2dsphere" });
gymSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Gym', gymSchema);