// routes/authRoutes.js
// Import modules
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create a router instance
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register'); // 'register' corresponds to 'register.ejs' in the views directory
});

//Registration route
router.post('/register', async (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;
    console.log('Received data:', username, password);

    try {
        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists ' });
        }

        // Hash the password before saving it to the database
        const saltRounds = 10;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password is required and must be at least 6 characters long' });
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user record and save it to the database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating user' });
    }
});

router.get('/login', (req, res) => {
    res.render('login'); // 'login' corresponds to 'login.ejs' in the views directory
});

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Pass any error to the next middleware
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Log in the user using req.login
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
  
        // Redirect to the user's profile page
        res.redirect('/profile');
      });
    })(req, res, next);
  });
  

// Logout route
router.get('/logout', (req, res) => {
    // Passport provides a logout() method to log the user out
    req.logout(() => {
        res.redirect('/'); // Redirect the user to the homepage after logout
    });
    
  });

// Export the router for use in the main application
module.exports = router;