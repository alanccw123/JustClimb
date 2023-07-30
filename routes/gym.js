const express = require('express');
const router = express.Router();
const Gym = require('../models/gym');
const Review = require('../models/review')
const loginRequired = require('../utils/loginRequired');
const isOwner = require('../utils/isOwner');
const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Client } = require("@googlemaps/google-maps-services-js");


// cloundinary api config for hosting images
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  secure: true
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'JustClimb',
  },
});
const upload = multer({ storage: storage });

//google map api client for goecoding
const client = new Client({});

const isBusinessUser = async (req, res, next) => {
  if (!req.user.isOwner) {
    req.flash('error', 'Unauthorized action!');
    return res.redirect("/gyms");
  }
  next();
}

// gym routes
router.get('/new', loginRequired, isBusinessUser, async (req, res) => {
  res.render('gym/newgym');
})

router.post('/new', loginRequired, isBusinessUser, upload.array('images', 8), async (req, res) => {
  const location = await client.geocode({
    params: {
      key: process.env.googlemap_api_key,
      address: req.body.location
    }
  });
  const { lat, lng } = location.data.results[0].geometry.location;
  const gym = new Gym(req.body.gym);
  gym.location = { type: 'Point', coordinates: [lng, lat] };
  gym.images = req.files.map((file) => file.path)
  gym.owner = req.user._id
  await gym.save();
  req.flash('success', 'Your gym has been added');
  res.redirect(`/gyms/${gym._id}`);
})

router.get('/query', async (req, res) => {
  let search = {}
  let sortby = {}
  if (req.query.search) {
    search = { $text: { $search: req.query.search } }
  }
  if (req.query.sortby === 'new') {
    sortby = {createdAt: -1}
  }else if (req.query.sortby === 'pricedesc'){
    sortby = {price: -1}
  }
  // const gyms = await Gym.find({ $text: { $search: req.query.search } },
  //   { score: { $meta: "textScore" } })
  //   .sort({ score: { $meta: "textScore" } })
  const gyms = await Gym.find(search).sort(sortby);
  res.render('gym/gyms', { gyms, search: req.query.search });
})

router.get('/:id', async (req, res) => {
  const gym = await Gym.findById(req.params.id).populate('reviews');
  res.render('gym/gym', { gym});
})

router.get('/', async (req, res) => {
  const gyms = await Gym.find({});
  res.render('gym/gyms', { gyms, search: req.query.search });
})

router.get('/:id/edit', loginRequired, isOwner, async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  res.render('gym/edit', { gym });
})

router.put('/:id/edit', loginRequired, isOwner, async (req, res) => {
  const gym = await Gym.updateOne({ _id: req.params.id }, req.body.gym);
  req.flash('success', 'Changed saved');
  res.redirect(`/gyms/${req.params.id}`)
})

router.delete('/:id/delete', loginRequired, isOwner, async (req, res) => {
  const gym = await Gym.findByIdAndDelete(req.params.id);
  await Review.deleteMany({ _id: { $in: gym.reviews } })
  req.flash('success', 'Your gym has been deleted');
  res.redirect('/gyms')
})


module.exports = router;