#!/usr/bin/node

// Importing necessary modules
const { v4 } = require('uuid'); // Importing the v4 function from the uuid module for generating UUIDs
const dbClient = require('../utils/db'); // Importing the database client utility
const redisClient = require('../utils/redis'); // Importing the Redis client utility
const { getAuthzHeader, getToken, pwdHashed } = require('../utils/utils'); // Importing utility functions from utils module
const { decodeToken, getCredentials } = require('../utils/utils'); // Importing utility functions from utils module

// Defining a class called AuthController
class AuthController {
  
  // Static method to handle user authentication
  static async getConnect(req, res) {
    const authzHeader = getAuthzHeader(req); // Getting the authorization header from the request
    if (!authzHeader) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if authorization header is missing
      res.end(); // End the response
      return;
    }
    const token = getToken(authzHeader); // Extracting token from the authorization header
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if token is missing
      res.end(); // End the response
      return;
    }
    const decodedToken = decodeToken(token); // Decoding the token
    if (!decodedToken) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if token is invalid
      res.end(); // End the response
      return;
    }
    const { email, password } = getCredentials(decodedToken); // Extracting email and password from the decoded token
    const user = await dbClient.getUser(email); // Retrieving user from the database using the email
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if user is not found
      res.end(); // End the response
      return;
    }
    if (user.password !== pwdHashed(password)) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if password doesn't match
      res.end(); // End the response
      return;
    }
    const accessToken = v4(); // Generating a new access token
    await redisClient.set(`auth_${accessToken}`, user._id.toString('utf8'), 60 * 60 * 24); // Storing the access token in Redis
    res.json({ token: accessToken }); // Sending the access token in the response
    res.end(); // End the response
  }

  // Static method to handle user logout
  static async getDisconnect(req, res) {
    const token = req.headers['x-token']; // Retrieving token from request headers
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if token is missing
      res.end(); // End the response
      return;
    }
    const id = await redisClient.get(`auth_${token}`); // Retrieving user ID from Redis using token
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if ID is not found
      res.end(); // End the response
      return;
    }
    const user = await dbClient.getUserById(id); // Retrieving user from database using ID
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if user is not found
      res.end(); // End the response
      return;
    }
    await redisClient.del(`auth_${token}`); // Deleting token from Redis
    res.status(204).end(); // Sending no content response
  }

  // Static method to get user information
  static async getMe(req, res) {
    const token = req.headers['x-token']; // Retrieving token from request headers
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if token is missing
      res.end(); // End the response
      return;
    }
    const id = await redisClient.get(`auth_${token}`); // Retrieving user ID from Redis using token
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if ID is not found
      res.end(); // End the response
      return;
    }
    const user = await dbClient.getUserById(id); // Retrieving user from database using ID
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' }); // Sending unauthorized error response if user is not found
      res.end(); // End the response
      return;
    }
    res.json({ id: user._id, email: user.email }).end(); // Sending user information in the response
  }
}

module.exports = AuthController; // Exporting the AuthController class for use in other modules
