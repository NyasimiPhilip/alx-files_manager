#!/usr/bin/node

// Importing necessary modules
const dbClient = require('../utils/db'); // Importing the database client utility

// Defining a class called UsersController
class UsersController {
  
  // Static method to handle creating a new user
  static async postNew(req, res) {
    const { email, password } = req.body; // Extracting email and password from the request body
    if (!email) {
      res.status(400).json({ error: 'Missing email' }); // Sending a bad request response if email is missing
      res.end(); // End the response
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' }); // Sending a bad request response if password is missing
      res.end(); // End the response
      return;
    }
    const userExist = await dbClient.userExist(email); // Checking if user already exists in the database
    if (userExist) {
      res.status(400).json({ error: 'Already exist' }); // Sending a bad request response if user already exists
      res.end(); // End the response
      return;
    }
    const user = await dbClient.createUser(email, password); // Creating a new user in the database
    const id = `${user.insertedId}`; // Extracting the ID of the newly created user
    res.status(201).json({ id, email }); // Sending a success response with the ID and email of the newly created user
    res.end(); // End the response
  }
}

module.exports = UsersController; // Exporting the UsersController class for use in other modules
