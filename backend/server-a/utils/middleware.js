const config = require('./config.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js')

/**
 * Request logger middleware
 * 
 * Prints the request method and url to the console.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {function} next 
 */
const requestLogger = (request, response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
};

/**
 * Error handler middleware
 * 
 * Handles various errors that have been recognized to happen in the application.
 * Returns appropriate status codes and error messages based on the error type
 * in the response object.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {function} next 
 */
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

/**
 * User extractor middleware
 * 
 * Extracts the request authorization header, decodes the possible jsonwebtoken 
 * and extracts the user information. User information is attached to the request object.
 * If no authorization header is present, the request object will not have a user property.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {function} next 
 */
const userExtractor = async (request, response, next) => {
  // Get auth header from request
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.replace('Bearer ', '');
    // Decode the token and extract user information
    const decodedToken = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decodedToken.id);
    // Attach the user to the request object
    request.user = user;
  }

  next();
};

/**
 * API key validator middleware
 * 
 * Compares the API key in the request header with the API key in the configuration file
 * if they match, sets the request.apiKeyValid to 1. If no API key is present in the request
 * the request object will not have the apiKeyValid property.
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {function} next 
 */
const apiKeyValidator = async (request, response, next) => {
  const apiKey = request.get('X-API-KEY');

  if (apiKey === config.apiKey) {
    request.apiKeyValid = 1;
  }
  
  next();
}

module.exports = { requestLogger, errorHandler, userExtractor, apiKeyValidator };