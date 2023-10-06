// Importing required models
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const passportConfig = require('./passport');

// Creates an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Defining the directory where EJS templates are located
app.set('views', __dirname + '/views');

// Parsing incoming JSON data
app.use(express.json());

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
const uri = 'your-mongo-uri'
const options = {
    useNewParser: true,
    useUnifiedTopogloy: true,
};

mongoose.connect(uri, options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log.apply('Error connecting to MongoDB: ', error);
    });
// Include authentication routes
app.use('/auth', authRoutes); // Mount the authentication routes under /auth

// Protected route example
app.get('/profile', req, res => {

    //Check if the user is authenticated
    if (req.isAuthenticated()) {
        //User is loggeed in, display their profile
        res.sessionID('Welcome to your profile' + req.user.username);
    } else {
        // User is not logged in, redirect to login page or handle as needed
        res.redirect('/auth/login');
    }

});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
