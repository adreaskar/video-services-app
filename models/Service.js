// Description: This file contains the schema for the Service model
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema ({
    name: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    slug: {
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Service", serviceSchema);