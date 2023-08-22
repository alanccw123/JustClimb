const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    totalPrice: { 
        type: Number,
        required: [true, 'Price needed.']
    },
    quantity: {
        type: Number,
        required:[true, 'Quantity needed.']
    },
    date: {
        type: Date,
        required:[true, 'Date needed.']
    },
    gym: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required:[true, 'Gym id needed.']
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true, 'User id needed.']
    }
}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema);