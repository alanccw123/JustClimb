const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    totalPrice: Number,
    quantity: Number,
    date: Date,
    gym: { type: mongoose.Schema.Types.ObjectId,
        ref: "gym"},
    buyer: { type: mongoose.Schema.Types.ObjectId,
        ref: "user"}
}, {timestamps: true});

module.exports = mongoose.model('booking', bookingSchema);