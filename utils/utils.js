#!/usr/bin/node

// Importing the sha1 library for hashing passwords
const sha1 = require('sha1');

// Function to hash the password using SHA-1 algorithm
export const pwdHashed = (pwd) => sha1(pwd);

// Function to extract the authorization header from the request
export const getAuthzHeader = (req) => {
  const header = req.headers.authorization;
  // If there's no authorization header, return null
  if (!header) {
    return null;
  }
  // Otherwise, return the authorization header
  return header;
};

// Function to extract the token from the authorization header
export const getToken = (authzHeader) => {
  // Extracting the token type from the authorization header
  const tokenType = authzHeader.substring(0, 6);
  // If the token type is not 'Basic ', return null
  if (tokenType !== 'Basic ') {
    return null;
  }
  // Otherwise, return the token (stripping off the token type)
  return authzHeader.substring(6);
};

// Function to decode the token from base64 encoding
export const decodeToken = (token) => {
  // Decoding the token from base64 to utf8
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  // If the decoded token does not contain a colon, return null
  if (!decodedToken.includes(':')) {
    return null;
  }
  // Otherwise, return the decoded token
  return decodedToken;
};

// Function to extract email and password from the decoded token
export const getCredentials = (decodedToken) => {
  // Splitting the decoded token into email and password using colon as delimiter
  const [email, password] = decodedToken.split(':');
  // If either email or password is missing, return null
  if (!email || !password) {
    return null;
  }
  // Otherwise, return an object containing email and password
  return { email, password };
};
