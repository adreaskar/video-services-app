// Description: This file contains the route for the home page

// Import libraries and modules.
const express = require('express');
const router = express.Router();
const countries = require('../modules/getCountries');

// Import models.
const Service = require('../models/Service');

// GET: /
// Description: This route is responsible for rendering the home page.
router.route("/")
    .get( async (req, res) => {

        // Get the first 3 services from the database.
        try {
            var services = await Service.find({}).limit(3);
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve services from the database:", error);
        }

        if (req.session.user) {
            res.render("home", { user: req.session.user, state: req.session.state, countryNames: [], services: services });
        } else {
            const countryNames = await countries;
            res.render("home", {user:null, state:null, countryNames: countryNames, services: services });
        }
    })

// Export the router.
module.exports = router;
