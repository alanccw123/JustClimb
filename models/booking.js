const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    totalPrice: { 
        type: Number,
        require: [true, 'Username needed.']
    },
    quantity: {
        type: Number,
        require:[true, 'Quantity needed.']
    },
    date: {
        type: Date,
        require:[true, 'Date needed.']
    },
    gym: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "gym",
        require:[true, 'Gym id needed.']
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require:[true, 'User id needed.']
    }
}, {timestamps: true});

module.exports = mongoose.model('booking', bookingSchema);