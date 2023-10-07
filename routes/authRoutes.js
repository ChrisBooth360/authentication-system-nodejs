// routes/authRoutes.js
// Import modules
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create a router instance
const router = express.Router();

//Registration route
router.post('/register', async (req, res) => {
    //Extract username and password from the request body
    const { username, password } = req.body;

    try {
        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists ' });
        }

        // Hashing the password before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user record and save it to the database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User registration successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating user' });
    }

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
    res.status(200).json({ message: 'Logout successful ' });
});

// Export the router for use in the main application
module.exports = router;