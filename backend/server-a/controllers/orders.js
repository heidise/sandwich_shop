const ordersRouter = require('express').Router();
const Order = require('../models/order.js');

const sendTask = require('../rabbit-utils/sendTask.js');

const hexa24_regex = /^[A-Fa-f0-9]{24}$/; // 24 character hexadecimal regex

/**
 * Returns all of the orders of the logged in user.
 */
ordersRouter.get('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  const orders = await Order.find({
    userId: request.user._id
  });
  
  response.json(orders);
});

/**
 * Gets orders details by the order id.
 */
ordersRouter.get('/:id', async (request, response) => {
  // Testing if provided id is 24 hexadecimal.
  if (!(hexa24_regex.test(request.params.id))) {
    return response.status(400).json({ error: 'Invalid ID supplied' });
  }

  const order = await Order.findById(request.params.id);

  if (!order) {
    response.status(404).json({ error: 'Order not found' });
  }
  else if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' });
  }
  else if (order.userId.toString() !== request.user._id.toString()) {
    response.status(401).json({ error: 'Unauthorized' });
  } 
  else {
    response.json(order);
  }
});

/**
 * Posts new sandwich order.
 */
ordersRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  const body = request.body;
  const order = new Order({
    sandwichId: body.sandwichId,
    status: body.status || 'ordered',
    userId: body.userId
  });

  try {
    const savedOrder = await order.save();
    // Send the order to the RabbitMQ queue
    sendTask.addTask("rapid-runner-rabbit", "message-queue-A", savedOrder);
    response.json(savedOrder);
  }
  catch {
    return response.status(400).json({ error: 'Order not created' });
  }
});

module.exports = ordersRouter;