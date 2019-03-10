// --- LOAD MODULES --- //

// Load the express module
const express = require('express');
// Load the express router
const router = express.Router();
// Load Mongoose Database
const mongoose = require('mongoose');
// Load Bcrypt Module
const bcrypt = require('bcryptjs');
// Load Passport Module
const passport = require('passport');



// LOAD USER MODEL
require('../models/User');
const User = mongoose.model('users');

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
        // User Email already exists
        User.findOne({email: req.body.email})
            .then(user => {
                if(user) {
                    req.flash('error_msg', "Email already registered");
                    res.redirect('/users/register');
                } else {
                    // Create new user from form input data
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    // Encrypt Password using Bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered, please log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log("Error: ", err);
                                    return;
                                });
                        });
                    });

                }
            });
    }
});


// Export the Router
module.exports = router;