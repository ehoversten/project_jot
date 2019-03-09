// Load the express module
const express = require('express');

// Invoke Express
const app = express();

// Declare a port 
const PORT = 5000;

// Tell the express app to listen on port XXXX
app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`);
}); 