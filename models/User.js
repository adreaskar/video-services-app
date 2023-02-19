// Description: This file contains the schema for the User model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    country: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    username: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    state: {    // pending, user, admin
        type:String,
        required:true
    }
});

module.exports = mongoose.model("User", userSchema);