#!/usr/bin/node

// Importing necessary modules
const redisClient = require('../utils/redis'); // Importing the Redis client utility
const dbClient = require('../utils/db'); // Importing the database client utility

// Defining a class called AppController
class AppController {
  
  // Static method to get the status
  static getStatus(req, res) {
    // Checking if both Redis client and database client are alive
    if (redisClient.isAlive() && dbClient.isAlive()) {
      // If both are alive, respond with a JSON indicating their status
      res.json({ redis: true, db: true });
      res.end(); // End the response
    }
  }

  // Static method to get statistics
  static async getStats(req, res) {
    // Getting the number of users from the database asynchronously
    const users = await dbClient.nbUsers();
    // Getting the number of files from the database asynchronously
    const files = await dbClient.nbFiles();
    // Responding with a JSON containing the retrieved statistics
    res.json({ users, files });
    res.end(); // End the response
  }
}

module.exports = AppController; // Exporting the AppController class for use in other modules
