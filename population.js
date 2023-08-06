const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/JustClimb');
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
            location_string: gyms[random].city,
            description: gyms[random].description,
            images: ['https://source.unsplash.com/random/900X700/?gym'],
            owner: dummy._id,
            price: Math.floor(Math.random() * 20) + 1

        });
        await gym.save();
    };
}

populate().then(() => {
    mongoose.connection.close();
});     