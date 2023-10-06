// Importing necessary modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Configure Passport to use a local strategy for athentication
passport.use(new LocalStrategy((username, password, done) => {
    // Find a user with the provided username in the database
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); } // Handles a possible DB error

        if (!user) {
            //If no user with that username exists, return an error
            return done(null, false, { message: 'Incorrect username.' });
        }

        // Check if the provided password matches the stored hased password
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.'});
        }

        // If everything is fine, return the user object
        return done(null, user);
    });
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
