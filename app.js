// app.js
// Importing required models
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/Passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

// Creates an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Defining the directory where EJS templates are located
app.set('views', __dirname + '/views');

// Parsing incoming JSON data
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Configuring session middleware
app.use(
    session({
        secret: 'super-secret', //Replace with a strong secret key for session management
        resave: false,
        saveUninitialized: false,
    })
);

// Initialising Passport.js
app.use(passport.initialize());

// Using Passport.js for managing sessions
app.use(passport.session());

// Connect to MongoDB (replace 'your-mongodb-uri' with your MongoDB connection string)
const uri = 'mongodb+srv://Cluster00121:WGlCU1BJcVxT@cluster00121.iowqabj.mongodb.net/testdb'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(uri, options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
// Include authentication routes
app.use('/auth', authRoutes); // Mount the authentication routes under /auth

app.get('/', (req, res) => {
    // Your route handling code here
    res.render('home');
  });

// Protected route example
app.get('/profile', (req, res) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // User is logged in, render the profile page
      res.render('profile', { user: req.user });
    } else {
      // User is not logged in, redirect to the login page or handle as needed
      res.redirect('/auth/login');
    }
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
