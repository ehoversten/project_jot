// --- LOAD MODULES --- //

// Load Express Module
const express = require('express');
// Load Path Module
const path = require('path');
// Load Express Handlebars Module
const exphbs = require('express-handlebars');
// Load Body Parser Module
/* (Parse incoming request bodies in a middleware before your handlers, available under the req.body property) */
const bodyParser = require('body-parser');
// Load Method Override Module
const methodOverride = require('method-override');
// Express Session Module
const session = require('express-session');
// Connect Flash Module (Flash Messages)
const flash = require('connect-flash');
// Load Mongoose Database Module
const mongoose = require('mongoose');


// Invoke Express
const app = express();

// Connect/Load external Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


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

// LOAD DATABASE DATA -> ** moved into ideas.js Router file
// require('./models/Idea');
// const Idea = mongoose.model('ideas');

// --- MIDDLEWEAR --- //

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express-Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Method Override
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Express Session
app.use(session({
    secret: 'pass1234',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Connect Flash Messages
app.use(flash());

// Global Variables 
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // calls next piece of middlewear
    next();
});


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


// Use External Routes
app.use('/ideas', ideas);
app.use('/users', users);

// --- SERVER --- //

// Declare a port
const PORT = 5000

// Tell the express app to listen on port XXXX
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
