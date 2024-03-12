#!/usr/bin/node

// Importing necessary modules
const { MongoClient } = require('mongodb'); // Importing MongoClient from MongoDB Node.js driver
const mongo = require('mongodb'); // Importing MongoDB module
const { pwdHashed } = require('./utils'); // Importing utility function for hashing passwords

// Defining a class called DBClient for interacting with MongoDB
class DBClient {
  constructor() {
    // Retrieving database connection settings from environment variables or using defaults
    const host = (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost';
    const port = (process.env.DB_PORT) ? process.env.DB_PORT : 27017;
    this.database = (process.env.DB_DATABASE) ? process.env.DB_DATABASE : 'files_manager';
    const dbUrl = `mongodb://${host}:${port}`;

    // Initializing MongoDB client
    this.connected = false;
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true });

    // Connecting to the MongoDB server
    this.client.connect().then(() => {
      this.connected = true;
    }).catch((err) => console.log(err.message));
  }

  // Method to check if the database connection is alive
  isAlive() {
    return this.connected;
  }

  // Method to get the number of users in the database
  async nbUsers() {
    await this.client.connect(); // Connect to the MongoDB server
    const users = await this.client.db(this.database).collection('users').countDocuments(); // Count the documents in the 'users' collection
    return users;
  }

  // Method to get the number of files in the database
  async nbFiles() {
    await this.client.connect(); // Connect to the MongoDB server
    const users = await this.client.db(this.database).collection('files').countDocuments(); // Count the documents in the 'files' collection
    return users;
  }

  // Method to create a new user in the database
  async createUser(email, password) {
    const hashedPwd = pwdHashed(password); // Hashing the password
    await this.client.connect(); // Connect to the MongoDB server
    const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedPwd }); // Inserting the user into the 'users' collection
    return user;
  }

  // Method to retrieve a user by email from the database
  async getUser(email) {
    await this.client.connect(); // Connect to the MongoDB server
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray(); // Finding the user by email in the 'users' collection
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  // Method to retrieve a user by ID from the database
  async getUserById(id) {
    const _id = new mongo.ObjectID(id); // Creating an ObjectID instance from the provided ID
    await this.client.connect(); // Connect to the MongoDB server
    const user = await this.client.db(this.database).collection('users').find({ _id }).toArray(); // Finding the user by ID in the 'users' collection
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  // Method to check if a user exists in the database by email
  async userExist(email) {
    const user = await this.getUser(email); // Checking if the user exists by email
    if (user) {
      return true;
    }
    return false;
  }
}

// Creating a new instance of the DBClient class
const dbClient = new DBClient();

// Exporting the DBClient instance for use in other modules
module.exports = dbClient;
