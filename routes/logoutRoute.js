// Description: This file contains the logout route

// Import libraries and modules.
const express = require('express');
const router = express.Router();

// GET: /logout
// Description: This route is responsible for logging out a user.
router.route("/logout")
    .get((req,res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/")
        });
    });

module.exports = router;