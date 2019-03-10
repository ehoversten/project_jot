// --- LOAD MODULES --- //

// Load the express module
const express = require('express');
// Load Express Handlebars Module
const exphbs = require('express-handlebars');
// Load Body Parser Module
/* (Parse incoming request bodies in a middleware before your handlers, available under the req.body property) */
const bodyParser = require('body-parser');
// Load Method Override Module
const methodOverride = require('method-override');
// Load Mongoose Database
const mongoose = require('mongoose');

// Invoke Express
const app = express();

// --- CONNECT TO DATABASE --- //
mongoose
  .connect(
    'mongodb://localhost/project_idea_dev',
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));

// LOAD DATABASE DATA
require('./models/Idea');
const Idea = mongoose.model('ideas');

// --- MIDDLEWEAR --- //

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express-Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Method Override
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));


// --- ROUTING --- //

// INDEX ROUTE
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  });
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about')
});

// IDEA LIST (INDEX) PAGE
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// ADD IDEA FORM PAGE
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// EDIT IDEA FORM
app.get('/ideas/edit/:id', (req, res) => {
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
app.post('/ideas', (req, res) => {
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
        // Promise
        .then(idea => {
            // redirect to Ideas List page
            res.redirect('/ideas');
        })
  }
});

// PROCESS EDIT FORM
app.put('/ideas/:id', (req, res) => {

    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        // input new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            })
    });
});

// DELETE IDEA
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/ideas')
        });
});

// --- SERVER --- //

// Declare a port
const PORT = 5000

// Tell the express app to listen on port XXXX
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
