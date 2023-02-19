// Description: This file contains the schema for the Service model
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema ({
    user: {
        type:String,
        required:true
    },
    date: {
        type:String,
        required:true
    },
    service: {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Booking", bookingSchema);