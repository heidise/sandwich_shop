'use strict';

const usersRouter = require('express').Router();
var User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('../utils/config.js');

/**
 * Creates a new user. If data doesn't fulfill registeration criteria, gives an error.
 */
usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password || !body.email) {
    response.status(400).json({ error: 'Username, password or email missing' });
  }

  if (!usernameIsValid(body.username)) {
    response.status(400).json({ error: 'Invalid username supplied. Can only consist of number, letter and _, ., - characters.' });
  }

  // Only creates a new user if user with the same username doesn't already exist.
  const user = await User.findOne({ username: body.username });
  if (user == null) {
    const new_user = new User({
      username: body.username,
      email: body.email,
      password: body.password,
    });
  
    try {
      const savedUser = await new_user.save();
      response.json(savedUser);
    }
    catch {
      response.status(400).json({ error: 'Not possible to create new user' });
    }
  }
  else {
    response.status(400).json({ error: 'User with the chosen username already exists' });
  }
});


/**
 * Logs user in the system.
 */
usersRouter.post('/login', async (request, response) => {
  const body = request.body;
  // Checks if user with same password and username is found on the db.
  const user = await User.findOne(
    {
    $and: [
      { username: body.username},
      { password: body.password},
    ]
  });

  if (user !== null) {
    // Generate a JWT, expires in 24*60*60 seconds (1h)
    const token = jwt.sign(
      {
        username: user.username,
        id: user._id
      },
      config.jwtSecret, 
      { expiresIn: 24 * 60 * 60 }
    );

    response.status(200).send({ token, username: user.username });
  }
  else {
    response.status(400).json({ error: 'Invalid username/password supplied' });
  }
});

/**
 * Get user by username.
 */
usersRouter.get('/:username', async (request, response) => {
  // First checks if username is valid.
  if (!usernameIsValid(request.params.username)) {
    response.status(400).json({ error: 'Invalid username supplied' });
  }
  else {
    const user = await User.findOne({ username: request.params.username });

    if (user !== null) {
      response.json(user);
    }
    else {
      response.status(404).json({ error: 'User not found' });
    }
  }
});

/**
 * Updates username. This can only be done by the logged in user.
 */
usersRouter.put('/:username', async (request, response) => {
  // Compare logged in users' username with the username in the URL
  if (!request.user || request.user.username !== request.params.username) {
    response.status(401).json({ error: 'Unauthorized' });
  }

  // First checks if username is valid. 
  if (!usernameIsValid(request.params.username)) {
    response.status(400).json({ error: 'Invalid user supplied' });
  }
  else {
    const body = request.body;
    const user = await User.findOneAndUpdate({ username: body.username }, 
    { username: request.params.username });

    if ( user === null ) {
      response.status(404).json({ error: 'User not found' });
    }
    else {
      response.status(204).end();
    }
  }
});

/**
 * Delete user. This can only be done by the logged in user.
 */
usersRouter.delete('/:username', async (request, response) => {
  // Only allow a logged in user to delete their own account.
  if (!request.user || request.user.username !== request.params.username) {
    return response.status(401).json({ error: 'Unauthorized' });
  }
  // First checks if username is valid. 
  if (!usernameIsValid(request.params.username)) {
    response.status(400).json({ error: 'Invalid username supplied' });
  }
  else {
    const user = await User.findOneAndDelete({ username: request.params.username });

    if ( user === null ) {
      response.status(404).json({ error: 'User not found' });
    }
    else {
      response.status(204).end();
    }
  }
});

// Function checks if username is valid. 
// Username can only consist of number, letter and _, ., - characters.
function usernameIsValid(username) {
  return /^[0-9a-zA-Z_.-]+$/.test(username);
}

module.exports = usersRouter;
