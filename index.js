// for loading env in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // serve secure cookies
}


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
const booking = require('./routes/booking')
const session = require('express-session')
const flash = require('connect-flash');
const User = require('./models/user');
const Gym = require('./models/gym');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const geoip = require('geoip-lite');
const Booking = require('./models/booking');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//session and cookie setting
const sess = {
    name: 'JustClimbId',
    secret: process.env.session_secret,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resave: false
}
if (process.env.NODE_ENV === 'production') {
    sess.cookie.secure = true // serve secure cookies
}

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
app.set('trust proxy', true);

// middleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(session(sess))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/", "https://cdnjs.cloudflare.com/"],
          "img-src":["'self'", "data:", "https://source.unsplash.com/", "https://images.unsplash.com/",
          "https://maps.googleapis.com/", "https://res.cloudinary.com/"],
        },
      },
  }));
app.use(mongoSanitize());
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
app.use('/bookings', booking);
app.use('/gyms/:id/reviews', reviews);


app.get('/', async(req, res) => {
    
    const geo = geoip.lookup("5.151.139.58");
    const gyms = await Gym.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [geo.ll[1], geo.ll[0]]
                }
            }
        }
    }).limit(10)
    res.render('index', { gyms });
})


// error handling
app.all('*', (req, res) => {
    throw new AppError('Not found', 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', {err})
})   

app.listen(3000, () => {
    console.log('Server is now running');
})