const sandwichesRouter = require('express').Router();
const Sandwich = require('../models/sandwich.js');
const mongoose = require('mongoose');

const hexa24_regex = /^[A-Fa-f0-9]{24}$/; // 24 character hexadecimal regex

/**
 * Returns all the sandwiches.
 */
sandwichesRouter.get('/', async (request, response) => {
  const sandwiches = await Sandwich.find({}).populate('toppings');
  response.json(sandwiches);
});

/**
 * Returns sandwich by their Id.
 */
sandwichesRouter.get('/:id', async (request, response) => {
  if (!(hexa24_regex.test(request.params.id))) {
    return response.status(400).json({ error: 'Invalid ID supplied' });
  }

  const sandwich = await Sandwich.findById(request.params.id).populate('toppings');
  if (!sandwich) {
    response.status(404).json({ error: 'Sandwich not found' });
  } else {
    response.json(sandwich);
  }
});

/**
 * Adds new sandwich to the store. API key is needed when posting.
 */
sandwichesRouter.post('/', async (request, response) => {
  if (!request.apiKeyValid) {
    return response.status(403).json({ error: 'Invalid/missing api key' });
  }

  try {
    const body = request.body;
    body.toppings = body.toppings.map(topping => new mongoose.Types.ObjectId(topping));
    const sandwich = new Sandwich({
      name: body.name,
      toppings: body.toppings,
      breadType: body.breadType,
      diet: body.diet
    });

    // Saving the sandwich.
    const savedSandwich = await sandwich.save();
    response.status(200).json(savedSandwich);
  }
  catch {
    return response.status(405).json({ error: 'Invalid input' });
  }
});

/**
 * Updates sandwich data for certain sandwich Id. Requires api key.
 */
sandwichesRouter.post('/:id', async (request, response) => {
  if (!request.apiKeyValid) {
    return response.status(403).json({ error: 'Invalid/missing api key' });
  }

  if (!(hexa24_regex.test(request.params.id))) {
    return response.status(400).json({ error: 'Invalid ID supplied' });
  }

  if (!request.body.name || !request.body.toppings || !request.body.breadType || !request.body.diet) {
    return response.status(405).json({ error: 'Invalid input.' });
  }
  
  const body = request.body;
  body.toppings = body.toppings.map(topping => new mongoose.Types.ObjectId(topping));

  const sandwich = {
    name: body.name,
    toppings: body.toppings,
    breadType: body.breadType,
    diet: body.diet
  };

  const updatedSandwich = await Sandwich.findByIdAndUpdate(request.params.id, sandwich, { new: true }).populate('toppings');

  if (!updatedSandwich) {
    return response.status(405).json({ error: 'Invalid input.' });
  }
  
  response.json(updatedSandwich);
});

/**
 * Deletes sandwich by Id. Requires api key.
 */
sandwichesRouter.delete('/:id', async (request, response) => {
  if (!request.apiKeyValid) {
    return response.status(403).json({ error: 'Invalid/missing api key' });
  }

  // Checking if Id is 24 hexadecimal.
  if (!(hexa24_regex.test(request.params.id))) {
    return response.status(400).json({ error: 'Invalid ID supplied' });
  }
  
  // Deleting a sandwich.
  const deleted = await Sandwich.findByIdAndDelete(request.params.id);
  if (!deleted) {
    response.status(404).json({ error: 'Sandwich not found' });
  }
  response.status(204).end();

});

module.exports = sandwichesRouter;