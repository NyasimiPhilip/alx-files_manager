#!/usr/bin/node

// Importing necessary modules
const { createClient } = require('redis'); // Importing createClient function from the 'redis' package
const { promisify } = require('util'); // Importing promisify function from the 'util' module

// Defining a class called RedisClient for interacting with Redis
class RedisClient {
  constructor() {
    // Creating a Redis client
    this.client = createClient(); // Creating a Redis client instance
    this.client.on('error', (err) => console.log(err)); // Handling errors if they occur during connection
    this.connected = false; // Flag to track the connection status
    this.client.on('connect', () => {
      this.connected = true; // Setting connected flag to true when connected to Redis
    });
  }

  // Method to check if the Redis connection is alive
  isAlive() {
    return this.connected;
  }

  // Method to asynchronously get a value from Redis based on a key
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client); // Promisifying the get method of the Redis client
    const val = await getAsync(key); // Getting the value asynchronously using the promisified method
    return val; // Returning the value
  }

  // Method to asynchronously set a value in Redis based on a key
  async set(key, val, dur) {
    const setAsync = promisify(this.client.set).bind(this.client); // Promisifying the set method of the Redis client
    await setAsync(key, val, 'EX', dur); // Setting the value asynchronously with an expiration time
  }

  // Method to asynchronously delete a key from Redis
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client); // Promisifying the del method of the Redis client
    await delAsync(key); // Deleting the key asynchronously
  }
}

// Creating a new instance of the RedisClient class
const redisClient = new RedisClient();

// Exporting the RedisClient instance for use in other modules
module.exports = redisClient;
