// Description: This file contains the route for the services page

// Import libraries and modules.
const express = require('express');
const router = express.Router();
const countries = require('../modules/getCountries');
const path = require('path');

// Import models.
const Service = require('../models/Service');

// GET: /services
// Description: This route is responsible for rendering the services page.
router.route("/services")
    .get( async (req, res) => {
        
        // Get the services from the database.
        try {
            var services = await Service.find({});
        } catch (error) {
            console.log("[ERROR] - Failed to retrieve services from the database:", error);
        }

        if (req.session.user) {
            res.render("services", { user: req.session.user, state: req.session.state, countryNames: [], services: services});
        } else {
            const countryNames = await countries;
            res.render("services", { user:null, state:null, countryNames: countryNames, services: services });
        }
    })

// POST: /services/add
// Description: This route is responsible for adding a service to the database.
router.route("/services/add")
    .post( async (req, res) => {

        // Get the service from the request body.
        let data = req.body;

        // Get the image from the request files.
        if (req.files == null) {
            data.image = undefined;
        }
        else {
            var { image } = req.files;
            data.image = image.name;
        }

        if (data.image != undefined) {
            image.mv(path.join(__dirname, '../public/img', image.name));
        };

        // Create the service object.
        const service = new Service({
            name: data.name,
            description: data.description,
            image: data.image,
            slug: data.name.toLowerCase().replace(/ /g, "-")
        });

        // Check if the service already exists in the database.
        try {
            var serviceExists = await Service.exists({ name: data.name });
        } catch (error) {
            console.log("[ERROR] - Failed to check if service exists in the database:", error);
        }

        // If the service already exists, return an error.
        if (serviceExists) {
            console.log("[INFO] - Failed to add service:", data.name, "already exists.");
            res.status(400).send("Service already exists.");
            return;
        }

        // Save the service to the database.
        try {
            service.save().then(() => {
                console.log("[INFO] - Added service:", data.name);
                res.status(200).send("Service added successfully.");
            });
        } catch (error) {
            console.log("[ERROR] - Failed to add service to the database:", error);
        }

    })


// POST: /services/edit
// Description: This route is responsible for editing a service in the database.
router.route("/services/edit")
    .post( async (req, res) => {

        // Get the service from the request body.
        let data = req.body;

        // Get the image from the request files.
        if (req.files == null) {
            data.image = undefined;
        } else {
            var { image } = req.files;
            data.image = image.name;
        }

        // Create the conditions and update for the service.
        const conditions = { name: data.name };
        const update = { 
            name: data.name,
            description: data.description,
        }
        if (data.image != undefined) {
            update.image = data.image
            image.mv(path.join(__dirname, '../public/img', image.name));
        };

        // Update the service in the database.
        try {
            Service.findOneAndUpdate(conditions, update).then(() => {
                console.log("[INFO] - Updated service:", data.name);
                res.status(200).send("Service updated successfully.");
            });
        } catch (error) {
            console.log("[ERROR] - Failed to update service in the database:", error);
        }
})

// POST: /services/delete
// Description: This route is responsible for deleting a service from the database.
router.route("/services/delete")
    .post( async (req, res) => {
            
            // Get the service id from the request body.
            const service = req.body.service;
    
            // Delete the user from the database.
            try {
                Service.deleteOne({ name:service }).then(() => {
                    console.log("[INFO] - Deleted service:", service);
                    res.status(200).send("Service deleted successfully.");
                });
            } catch (error) {
                console.log("[ERROR] - Failed to delete service from the database:", error);
            }
    })

// GET: /adminservices
// Description: This route is responsible for rendering the admin services page.
router.route("/adminservices")
    .get( async (req, res) => {
            
            // Get the services from the database.
            try {
                var services = await Service.find({});
            } catch (error) {
                console.log("[ERROR] - Failed to retrieve services from the database:", error);
            }
    
            res.render("adminservices", { user: req.session.user, state: req.session.state, countryNames: [], services: services});
    })


// Export the router.
module.exports = router;
