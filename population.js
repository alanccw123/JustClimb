if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); 
}
const db_url = process.env.db_url || 'mongodb://127.0.0.1:27017/JustClimb';

const mongoose = require('mongoose');
mongoose.connect(db_url);
const Gym = require('./models/gym');
const User = require('./models/user');
const Review = require('./models/review');
const Booking = require('./models/booking');
const gyms = require('./seed');

const populate = async () => {
    await Gym.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});

    const dummy = await User.register({ username: 'alan', isOwner: true }, 'alan');
    await User.register({username: 'admin', isAdmin: true}, 'admin');

    for (let index = 0; index < 50; index++) {
        const random = Math.floor(Math.random() * gyms.length)
        const gym = new Gym({
            name: gyms[random].name,
            location: {
                "type": "Point",
                "coordinates": [
                    gyms[random].longitude,
                    gyms[random].latitude
                ]
            },
            website: gyms[random].url || 'N/A',
            contact: gyms[random].phone || 'N/A',
            location_string: gyms[random].city || 'Glasgow',
            description: gyms[random].description,
            images: ['https://source.unsplash.com/random/900x700/?gym&1',
            'https://source.unsplash.com/random/900x700/?gym&2'],
            owner: dummy._id,
            price: Math.floor(Math.random() * 20) + 1

        });
        await gym.save();
    };
}

populate().then(() => {
    mongoose.connection.close();
});     