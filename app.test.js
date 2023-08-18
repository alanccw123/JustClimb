const mongoose = require('mongoose');

const User = require('./models/user');
const Gym = require('./models/gym');
const Booking = require('./models/booking');
const Review = require('./models/review');

// connect to test database before the test code is run
beforeAll(() => {
    mongoose.connect('mongodb://127.0.0.1:27017/JustClimbTest').then(
        () => { console.log('connection open') },
        err => { console.log('connection failed') }
    );
})

// delete all test data after tests are done
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
})

// gym model tests
describe('Gym Model Test', () => {

    const gymData = { name: "dummy", price: 30, description: "testing", location_string: "glasgow", location: { type: "Point", coordinates: [-4.251433, 55.860916] } };

    test('create & save a gym', async () => {
        expect.assertions(7);

        const gym = new Gym(gymData);
        const user = await User.register({ username: "player1" }, "fakepassword");
        gym.owner = user._id;
        await gym.save();
        expect(gym._id).toBeDefined();
        expect(gym.name).toBe(gymData.name);
        expect(gym.price).toBe(gymData.price);
        expect(gym.description).toBe(gymData.description);
        expect(gym.location_string).toBe(gymData.location_string);
        expect(gym.location).toEqual(gymData.location);
        expect(gym.createdAt).toBeDefined();

    });

    // any undefined field is simply ignored but the document is still created
    test('undefined field in the Schema is ignored', async () => {
        expect.assertions(2);
        const user = await User.register({ username: "player2" }, "fakepassword");
        const gym = new Gym({ ...gymData, undefined: "undefined" });
        gym.owner = user._id;
        await gym.save();
        expect(gym._id).toBeDefined();
        expect(gym.undefined).toBeUndefined();
    });

    // mongoose would throw validation error when a required field is missing
    test('create a gym without a owner is not allowed', async () => {
        expect.assertions(1);
        const gym = new Gym(gymData)
        await expect(async () => { await gym.save() }).rejects.toThrow(mongoose.Error.ValidationError);

    });

})

describe('Review Model Test', () => {


    test('create & save a review', async () => {
        expect.assertions(1);
        const review = new Review({ comment: "fake comments", rating: 4 });
        const user = await User.register({ username: "player3" }, "fakepassword");
        review.author = user._id;
        await review.save();
        expect(review._id).toBeDefined();
    });

    test('create a review without rating is not allowed', async () => {
        expect.assertions(1);
        const review = new Review({ comment: "fake comments" });
        const user = await User.register({ username: "player4" }, "fakepassword");
        review.author = user._id;
        await expect(async () => { await review.save() }).rejects.toThrow(mongoose.Error.ValidationError);
    });


})

describe('User Model Test', () => {

    test('register a user', async () => {
        expect.assertions(1);
        const user = await User.register({ username: "player5" }, "fakepassword");
        expect(user._id).toBeDefined();
    });

    test('cannot register user with same username', async () => {
        expect.assertions(1);
        const user = await User.register({ username: "player6" }, "fakepassword");
        await expect(async () => { await User.register({ username: "player6" }, "fakepassword") }).rejects.toThrow(Error);
    });

    test('password is stored as hash', async () => {
        expect.assertions(1);
        const user = await User.register({ username: "player7" }, "fakepassword");
        expect(user.password).not.toBe("fakepassword");
    });
})

describe('Booking Model Test', () => {



    test('create & save a booking', async () => {
        expect.assertions(1);
        const user = await User.register({ username: "player8" }, "fakepassword");
        const gym = new Gym({ name: "dummy", price: 30, description: "testing", location_string: "glasgow", location: { type: "Point", coordinates: [-4.251433, 55.860916] } })
        gym.owner = user._id;
        await gym.save()
        const booking = new Booking({ totalPrice: 120, quantity: 5, date: new Date() });
        booking.buyer = user._id;
        booking.gym = gym._id;
        await booking.save();
        expect(booking._id).toBeDefined();
    });

    test('retrieve bookings by user', async () => {
        expect.assertions(1);
        const user = await User.register({ username: "player9" }, "fakepassword");
        const gym = new Gym({ name: "dummy", price: 30, description: "testing", location_string: "glasgow", location: { type: "Point", coordinates: [-4.251433, 55.860916] } })
        gym.owner = user._id;
        await gym.save()
        const booking = new Booking({ totalPrice: 120, quantity: 5, date: new Date() });
        booking.buyer = user._id;
        booking.gym = gym._id;
        await booking.save();
        await expect(await Booking.find({ buyer: user._id })).toHaveLength(1);
    });


})