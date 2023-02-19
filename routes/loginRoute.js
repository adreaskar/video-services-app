// Description: This file contains the route for the login endpoint

// Import libraries and modules.
const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');

// Import models.
const User = require('../models/User');

// POST: /login
// Description: This route is responsible for logging in a user.
router.route("/login")
    .post((req, res) => {

        // Get the data from the request body
        let data = req.body;

        const ref = req.headers.referer.split("/");
        const refPage = ref[ref.length - 1];

        // Hash the password
        data.password = crypto.createHash('sha256').update(req.body.password).digest('hex');

        // Search for existing user with given username and password ----------------------
        User.find({ username: data.username, password: data.password }, (err, data) => {
            if (err) {
                console.log("[ERROR] - An error occurred while searching for existing users:");
                console.log(err);
                res.status(500).send("An error occurred while searching for existing users");
            } else {

                // User does not exist
                if (data.length === 0) {
                    console.log('[INFO] - Login failed: No user found');
                    res.status(401).send("Login failed: No user found");
                
                // User exists
                } else {

                    if (data[0].state === "pending") {
                        console.log('[INFO] - Login failed: User is pending');
                        res.status(401).send("pending");
                        return;
                    } else if (data[0].state === "user") {
                        req.session.state = "user";
                    } else if (data[0].state === "admin") {
                        req.session.state = "admin";
                    }
                    req.session.user = req.body.username;
                    req.session.email = data[0].email;

                    res.status(200).send(refPage);
                }
            }
        });
    });

// Export the router.
module.exports = router;
