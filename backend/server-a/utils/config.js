'use strict';

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  serverPort: process.env['PORT'] ?? 8080,
  dbUri: process.env['MONGODB_URI'] ?? 'mongodb://127.0.0.1:27017/crazepiano',
  jwtSecret: process.env['JWT_SECRET'] ?? 'secret',
  apiKey: process.env['API_KEY'] ?? 'sekret'
};