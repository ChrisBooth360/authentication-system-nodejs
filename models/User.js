// Importing mongoose module
const mongoose = require('mongoose');

// Defining the user schema using Mongoose Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Creating the User model using the user schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;