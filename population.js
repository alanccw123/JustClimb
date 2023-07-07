const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/JustClimb');
const Gym = require('./models/gym');
const gyms = require('./seed');

const populate = async() => {
    await Gym.deleteMany({});

    for (let index = 0; index < 50; index++) {
        const random = Math.floor(Math.random() * gyms.length)
        const gym = new Gym({name: gyms[random].name, 
            location: gyms[random].city, description: gyms[random].description,
        image: 'https://source.unsplash.com/random/900X700/?gym'});
        await gym.save();    
    };
}

populate().then(() => {
    mongoose.connection.close();
});     