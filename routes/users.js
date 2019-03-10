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

// User Registration Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register form PROCESS
router.post('/register', (req, res) => {
    // TESTING
    // console.log(req.body);
    // res.send("Registered");

    let errors = [];

    if(req.body.password != req.body.password2) {
        errors.push({text:"Passwords do not match"});
    }

    if(req.body.password.length < 4) {
        errors.push({text: "Password must be greater than 4 characters"});
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        res.send("User Registered");
    }
});


// Export the Router
module.exports = router;