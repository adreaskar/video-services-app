// Description: This file contains the route for the booking of a service.

// Import libraries and modules.
const express = require('express');
const router = express.Router();

// Import models.
const Booking = require('../models/Booking');


// GET: /bookings
router.route("/bookings")
    .get( async (req, res) => {

        // Get all user bookings from the database.
        try {
            var bookings = await Booking.find({ user: req.session.user })
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve bookings from the database:", error);
        }

        // Sort the bookings by date.
        bookings.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        res.render("bookings", { user: req.session.user, bookings: bookings, countryNames: [], state:req.session.state });
    })


// POST: /services/book
// Description: This route is responsible for handling the booking of a service.
router.route("/book")
    .post( async (req, res) => {

        const data = req.body;

        // Check if user has already booked the service on that date.
        try {
            var booking = await Booking.findOne({ service: data.service, date: data.bookdate, user: data.user });
            if (booking) {
                res.status(400).send("You have already booked this service on this date.");
                return;
            }
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve booking from the database:", error);
        }

        // Check if the user has booked another service on that date.
        try {
            var booking = await Booking.findOne({ date: data.bookdate, user: data.user });
            if (booking) {
                res.status(400).send("You have booked another service on this date.");
                return;
            }
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve booking from the database:", error);
        }

        // Check another user has already booked the service on that date.
        try {
            var booking = await Booking.findOne({ service: data.service, date: data.bookdate });
            if (booking) {
                res.status(400).send("Another user has already booked this service on this date.");
                return;
            }
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve booking from the database:", error);
        }

        // Create a new booking.
        const newBooking = new Booking({
            service: data.service,
            date: data.bookdate,
            user: data.user
        });
        
        // Save the booking to the database.
        try {
            await newBooking.save();
        } catch (error) {
            console.log("[ERROR] - Failed to save booking to the database:", error);
        }

        res.status(200).send("Booking saved.");
        
    })

// Export the router.
module.exports = router;