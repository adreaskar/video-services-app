// Description: This file contains the route for the users page

// Import libraries and modules.
const express = require('express');
const router = express.Router();
const countries = require('../modules/getCountries');
const crypto = require('node:crypto');

// Import models.
const User = require('../models/User');

// GET: /users
// Description: This route is responsible for rendering the users page.
router.route("/users")
    .get( async (req, res) => {

        const countryNames = await countries;
        
        // Get the users from the database.
        try {
            var users = await User.find({});
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve users from the database:", error);
        }

        // Sort the users by state.
        // Always put the users with pending state at the bottom.
        users.sort((a, b) => {
            if (a.state == "pending") return 1;
            if (b.state == "pending") return -1;
            return a.state.localeCompare(b.state);
        });

        res.render("users", { user: req.session.user, state: req.session.state, countryNames: countryNames, users: users})
    })

// POST: /users/edit
// Description: This route is responsible for editing a user in the database.
router.route("/users/edit")
    .post( async (req, res) => {

        // Get the username from the request body.
        let username = req.body.username;

        const conditions = { username: username };
        const update = { 
            username: req.body.newUsername,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            country: req.body.country,
            city: req.body.city,
            state: req.body.state,
            address: req.body.address,
        };
        if (update.city == "") delete update.city;
        if (update.password != "") {
            update.password = crypto.createHash('sha256').update(update.password).digest('hex')
        } else {
            delete update.password;
        }

        // Update the user in the database.
        try {
            User.findOneAndUpdate(conditions, update).then(() => {
                console.log("[INFO] - Updated user:", username);
                res.status(200).send("User updated successfully.");
            });
        } catch (error) {
            console.log("[ERROR] - Failed to update user in the database:", error);
        }
        
    })

// POST: /users/delete
// Description: This route is responsible for deleting a user from the database.
router.route("/users/delete")
    .post( async (req, res) => {

        // Get the username from the request body.
        let username = req.body.username;

        // Delete the user from the database.
        try {
            User.deleteOne({ username: username }).then(() => {
                console.log("[INFO] - Deleted user:", username);
                res.status(200).send("User deleted successfully.");
            });
        } catch (error) {
            console.log("[ERROR] - Failed to delete user from the database:", error);
        }

    })

// Export the router.
module.exports = router;
