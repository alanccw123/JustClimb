// for loading env in development, delete in production
require('dotenv').config();

// packages
const express = require('express');
const app = express();
require('express-async-errors');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan')
const AppError = require('./utils/AppError')
const gyms = require('./routes/gym')
const reviews = require('./routes/review')
const auth = require('./routes/auth')
const session = require('express-session')
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// connect to db
mongoose.connect('mongodb://127.0.0.1:27017/JustClimb').then(
    () => { console.log('connection open') },
    err => { console.log('connection failed') }
  );
mongoose.connection.on('error', err => {
console.log(err);
});

// app setting
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'))
app.set('views', path.join(__dirname,'views'));

// middleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(session({saveUninitialized: true, secret: 'cryptographysucks'}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.isLoggedin = req.isAuthenticated();
    res.locals.loggedinUser = req.user;
    next();
})


// routers
app.use('/', auth);
app.use('/gyms', gyms);
app.use('/gyms/:id/reviews', reviews);


app.get('/', (req, res) => {
    res.render('index');
})


// // gym routes
// app.get('/gyms/new', async(req, res) => {
//     res.render('gym/newgym');
// })

// app.post('/gyms/new', async(req, res) => {
//     const gym = new Gym(req.body.gym);
//     await gym.save();
//     res.redirect('/gyms');
// })

// app.get('/gyms/:id', async (req, res) => {
//     const gym = await Gym.findById({_id: req.params.id}).populate('reviews');
//     res.render('gym/gym', {gym});
// })

// app.get('/gyms', async (req, res) => {
//     const gyms = await Gym.find({});
//     res.render('gym/gyms', {gyms});
// }) 

// app.get('/gyms/:id/edit', async (req, res) => {
//     const gym = await Gym.findById(req.params.id);
//     res.render('gym/edit', {gym});
// })

// app.put('/gyms/:id/edit', async (req, res) => {
//     const gym = await Gym.updateOne({_id: req.params.id}, req.body.gym);
//     res.redirect(`/gyms/${req.params.id}`)
// })

// app.delete('/gyms/:id/delete', async (req, res) => {
//     const gym = await Gym.findByIdAndDelete(req.params.id);
//     await Review.deleteMany({_id : {$in : gym.reviews}})
//     res.redirect('/gyms')
// })

// review routes
// app.post('/gyms/:id/reviews', async (req, res) => {
//     const review = new Review(req.body.review)
//     const gym = await Gym.findById(req.params.id)
//     gym.reviews.push(review)
//     await review.save()
//     await gym.save()
//     res.redirect(`/gyms/${req.params.id}`)
// })

// app.delete('/gyms/:id/reviews/:reviewid', async(req, res) => {
//     console.log("delete")
//     await Review.findByIdAndDelete(req.params.reviewid);
//     await Gym.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewid} });
//     res.redirect(`/gyms/${req.params.id}`);
// })



// error handling
app.all('*', (req, res) => {
    throw new AppError('Not found', 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    console.log(err)
    res.status(statusCode).render('error', {err})
})   

app.listen(3000, () => {
    console.log('Server is now running');
})