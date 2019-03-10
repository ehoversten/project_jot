// --- LOAD MODULES --- //

// Load the express module
const express = require('express');
// Load the express router
const router = express.Router();
// Load Mongoose Database
const mongoose = require('mongoose');


// LOAD DATABASE DATA
require('../models/Idea');
const Idea = mongoose.model('ideas');


// --- ROUTING --- //


// IDEA LIST (INDEX) PAGE
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// ADD IDEA FORM PAGE
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// EDIT IDEA FORM
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});

// PROCESS ADD FORM
router.post('/', (req, res) => {
    /* A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). */
    // console.log(req.body);
    // res.send('OK');

    // Create ERRORS array
    let errors = []
    // Server-side form validation
    if (!req.body.title) {
        errors.push({ text: 'Please enter a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please enter a description' });
    }
    // IF ERRORS EXIST
    if (errors.length > 0) {
        // re-render the form
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        //   res.send("PASSED");
        // Save new OBJECT to Database
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            // user: req.user.id
        }
        new Idea(newUser)
            .save()
            // Create Promise
            .then(idea => {
                // show flash message
                req.flash('success_msg', 'Project Idea Added');

                // redirect to Ideas List page
                res.redirect('/ideas');
            });
    }
});

// PROCESS EDIT FORM
router.put('/:id', (req, res) => {

    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // input new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    // show flash message
                    req.flash('success_msg', 'Project Idea Updated');
                    res.redirect('/ideas');
                });
        });
});

// DELETE IDEA
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            // show flash message
            req.flash('success_msg', 'Project Idea Removed');
            res.redirect('/ideas');
        });
});

// Export the Router
module.exports = router;