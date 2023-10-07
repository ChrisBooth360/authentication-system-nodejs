// config/Passport.js
// Importing necessary modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Configure Passport to use a local strategy for athentication
passport.use(new LocalStrategy(async (username, password, done) => {
    
    try {

        // Find a user with the provided username in the database
        const user = await User.findOne({ username: username })

        if (!user) {
            //If no user with that username exists, return an error
            return done(null, false, { message: 'Incorrect username.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        return done(null, user);

    } catch (err){
        return done(err);
    }


}))


// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
