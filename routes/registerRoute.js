// Description: This file contains the route for the register endpoint

// Import libraries and modules.
const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');

// Import models.
const User = require('../models/User');

// POST: /register
// Description: This route is responsible for registering a new user.
router.route("/register")
    .post((req, res) => {

        // Get the data from the request body
        let data = req.body;

        // Hash the password
        data.password = crypto.createHash('sha256').update(data.password).digest('hex');

        // Create a new user object
        let user = new User({
            firstName: data.firstname,
            lastName: data.lastname,
            country: data.country,
            city: data.city,
            address: data.address,
            email: data.email,
            username: data.username,
            password: data.password,
            state: 'pending'
        });

        // Search for existing users with given username and email
        User.find({$or:[{'email':data.email},{'username':data.username}]}, (err, data) => {
            if (err) {
                console.log("[ERROR] - An error occurred while searching for existing users:");
                console.log(err);
                res.status(500).send("Internal Server Error");
            } else {

                // User does not exist
                if (data.length === 0) {
                    user.save((err) => {
                        if (err) {
                            console.log("[ERROR] - Failed to save user to database:", err);
                            res.status(500).send("Internal Server Error");
                        } else {
                            console.log("[INFO] - User registered successfully");
                            res.status(200).send("User saved successfully");
                        }
                    });

                // User already exists
                } else {
                    console.log('[INFO] - User register failed: user already exists');
                    res.status(401).send("User already exists");
                }
            }
        })
    })

// Export the router.
module.exports = router;
