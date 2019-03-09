// --- LOAD MODULES --- //

// Load the express module
const express = require('express');
// Load Express Handlebars Module
const exphbs = require('express-handlebars');

// Invoke Express
const app = express();

// --- MIDDLEWEAR --- //

// Express-Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


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
    res.render('about');
});

// --- SERVER --- //

// Declare a port 
const PORT = 5000;

// Tell the express app to listen on port XXXX
app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`);
}); 