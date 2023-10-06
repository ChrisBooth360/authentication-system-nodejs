// Import modules
const express = require('express');
const passport = require('passport');
const User = require('../models/User');

// Create a router instance
const router = express.Router();

//Registration route
router.post('/register', (req, res) => {
    //Extract username and password from the request body
    const { username , password } = req.body;

    // Check if the username already exists in the database
    User.findOne({ username: username }, (err, existingUser) =>{
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists '});
        }

        // Create a new user record and save it to the database
        const newUser = new User({ username, password });
        newUser.save((err) => {
            // Handles an error
            if (err) {
                return res.status(500).json({ message: 'Error creating user' });
            }

            return res.status(201).json({ message: 'User registation successful' })
        });
    });
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    //If authentication is successful, Passport.js handles this route
    res.status(200).json({ message: 'Login successful' });
});

// Logout route
router.get('/logout', (req, res) => {
    // Passport provides a logout() method to log the user out
    req.logout();
    res.status(200).json({ message: 'Logout successful '});
});

// Export the router for use in the main application
module.exports = router;