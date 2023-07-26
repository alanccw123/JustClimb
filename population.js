const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/JustClimb');
const Gym = require('./models/gym');
const User = require('./models/user');
const gyms = require('./seed');

const populate = async() => {
    await Gym.deleteMany({});
    await User.deleteMany({});

    const dummy = await User.register({username: 'alan', isOwner: true}, 'alan');

    for (let index = 0; index < 50; index++) {
        const random = Math.floor(Math.random() * gyms.length)
        const gym = new Gym({name: gyms[random].name, 
            location: {
                "type" : "Point",
                "coordinates" : [
                  gyms[random].longitude,
                  gyms[random].latitude
                ]
              }, description: gyms[random].description,
        images: ['https://source.unsplash.com/random/900X700/?gym'], owner: dummy._id});
        await gym.save();    
    };
}

populate().then(() => {
    mongoose.connection.close();
});     