// --- LOAD MODULES --- //

// Load the express module
const express = require('express');
// Load the express router
const router = express.Router();
// Load Mongoose Database
const mongoose = require('mongoose');


// LOAD DATABASE DATA
// require('../models/User');
// const User = mongoose.model('users');

// --- ROUTING --- //

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});


// Export the Router
module.exports = router;