// Description: This is the main file of our application. It is the entry point of our application.
// It is responsible for creating the server and configuring the middleware.

// Import libraries and modules.
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const session = require('express-session');

// Database connection.
mongoose.set('strictQuery', false);

async function conn() {
  await mongoose.connect('mongodb://mongo/VEDB');
  console.log('[INFO] - Connected to MongoDB');
}

conn().catch(err => console.log('[ERROR] - Could not connect to MongoDB\n', err));

// Create express app and http server.
const app = express();
const server = http.createServer(app);

// Middleware.
// Libraries and configurations for our application
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/css",express.static(path.join(__dirname, "node_modules/mdb-ui-kit/css")))

app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/js",express.static(path.join(__dirname, "node_modules/mdb-ui-kit/js")))
app.use("/js",express.static(path.join(__dirname, "node_modules/jquery/dist")))

app.use(session({
  secret:'videoexperts',
  resave:false,
  saveUninitialized:false,
  store:MongoStore.create({
      mongoUrl: 'mongodb://mongo/VEDB',
      collection:'sessions'
  })
}));

// Routes.
// Import the routes of our application.
const homeRoute = require('./routes/homeRoute');

// Use the routes.
app.use(homeRoute);

server.listen(4000, () => {
  console.log('[INFO] - Server is running on port 4000');
});

