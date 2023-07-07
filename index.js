const express = require('express');
const app = express();
require('express-async-errors');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan')
const AppError = require('./AppError')

mongoose.connect('mongodb://127.0.0.1:27017/JustClimb');
const Gym = require('./models/gym');

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'))
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/gyms/new', async(req, res) => {
    res.render('gym/newgym');
})

app.post('/gyms/new', async(req, res) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.redirect('/gyms');
})

app.get('/gyms/:id', async (req, res) => {
    const gym = await Gym.findById({_id: req.params.id});
    res.render('gym/gym', {gym});
})

app.get('/gyms', async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gym/gyms', {gyms});
}) 

app.get('/gyms/:id/edit', async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    res.render('gym/edit', {gym});
})

app.put('/gyms/:id/edit', async (req, res) => {
    const gym = await Gym.updateOne({_id: req.params.id}, req.body.gym);
    res.redirect(`/gyms/${req.params.id}`)
})

app.delete('/gyms/:id/delete', async (req, res) => {
    await Gym.findByIdAndDelete(req.params.id);
    console.log('deleted an object')
    res.redirect('/gyms')
})

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