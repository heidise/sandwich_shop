const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const YAML = require('yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

// Read the Swagger file
const swaggerFile = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

// Modules
const middleware = require('./utils/middleware.js');
const receiveTask = require('./rabbit-utils/receiveTask.js');
const ordersRouter = require('./controllers/orders.js');
const sandwichesRouter = require('./controllers/sandwiches.js');
const usersRouter = require('./controllers/users.js');
const mongo = require('./utils/mongo.js');

// Create the Express app
app = express();

// Start the RabbitMQ consumer
receiveTask.getTask('rapid-runner-rabbit', 'message-queue-B');

// Connect to MongoDB
mongo.connectToDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.userExtractor);
app.use(middleware.apiKeyValidator);

// Routes
app.use('/v1/order', ordersRouter);
app.use('/v1/sandwich', sandwichesRouter);
app.use('/v1/user', usersRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(middleware.errorHandler);

module.exports = app;
