// Description: This file contains the route for the home page

// Import libraries and modules.
const express = require('express');
const router = express.Router();

// Routes.

// GET: /home
// Description: This route is responsible for rendering the home page.
// Parameters: None
router.route("/")
    .get((req,res) => {
        res.render("home");
    })

// Export the router.
module.exports = router;
