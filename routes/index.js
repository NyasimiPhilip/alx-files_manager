#!/usr/bin/node

// Importing the Express.js framework
const express = require('express');

// Importing controllers for handling different routes
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// Creating a new Express Router
const router = express.Router();

// Defining routes and associating them with controller methods
router.get('/status', AppController.getStatus); // Route for getting status
router.get('/stats', AppController.getStats); // Route for getting statistics
router.post('/users', UsersController.postNew); // Route for creating new users
router.get('/connect', AuthController.getConnect); // Route for user authentication
router.get('/disconnect', AuthController.getDisconnect); // Route for user logout
router.get('/users/me', AuthController.getMe); // Route for getting user information

module.exports = router; // Exporting the router for use in other modules
