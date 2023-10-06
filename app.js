// Importing required models
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express(); // Creates an Express application

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
app.use(passwort.initialize());

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
