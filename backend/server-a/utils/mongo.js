const mongoose = require('mongoose');
const config = require('./config.js');

const User = require('../models/user.js');
const Topping = require('../models/topping.js');
const Sandwich = require('../models/sandwich.js');

/**
 * MongoDB connector
 */
const connectToDb = async () => {
  console.log(`connecting to MongoDB at ${config.dbUri}`);
  try {
    await mongoose.connect(config.dbUri);
    const sandwiches = await Sandwich.find({});
    if (sandwiches.length == 0) {
      console.log('Seeding database')
      await seedDb();
      console.log('Database seeded successfully')
    }
  } catch (error) {
    console.error('error connecting to MongoDB:', error.message);
  }
};

/**
 * MongoDB data seeder
 */
const seedDb = async () => {
  try {
    await mongoose.connection.dropDatabase();

    const exampleUsers = [
      {
        username: 'alice',
        password: 'daisy',
        email: 'alice@email.com',
      },
      {
        username: 'bob',
        password: 'builder',
        email: 'bob@othermail.com',
      },
      {
        username: 'user1',
        password: 'password',
        email: 'user1@useremail.com',
      },
    ];

    const userPromises = exampleUsers.map(async (user) => {
      const newUser = new User(user);
      await newUser.save();
    });

    await Promise.all(userPromises);

    const exampleToppings = [
      {
        name: 'lettuce',
      },
      {
        name: 'tomato',
      },
      {
        name: 'cucumber',
      },
      {
        name: 'ham',
      },
      {
        name: 'mayonnaise',
      },
      {
        name: 'cheddar cheese',
      },
      {
        name: 'butter',
      },
      {
        name: 'egg',
      },
      {
        name: 'bacon',
      },
      {
        name: 'avocado',
      },
      {
        name: 'margarine',
      }
    ];

    const toppingPromises = exampleToppings.map(async (topping) => {
      const newTopping = new Topping(topping);
      await newTopping.save();
    });

    await Promise.all(toppingPromises);

    const exampleSandwiches = [
      {
        name: 'Ham Sandwich',
        toppings: [
          await Topping.findOne({ name: 'ham' }),
          await Topping.findOne({ name: 'lettuce' }),
          await Topping.findOne({ name: 'tomato' }),
          await Topping.findOne({ name: 'mayonnaise' }),
        ],
        breadType: 'whole wheat',
      },
      {
        name: 'Grilled Cheese Sandwich',
        toppings: [
          await Topping.findOne({ name: 'cheddar cheese' }),
          await Topping.findOne({ name: 'butter' }),
        ],
        breadType: 'white',
      },
      {
        name: 'Bacon and Egg Sandwich',
        toppings: [
          await Topping.findOne({ name: 'egg' }),
          await Topping.findOne({ name: 'bacon' }),
          await Topping.findOne({ name: 'tomato' }),
          await Topping.findOne({ name: 'margarine' }),
        ],
        breadType: 'whole wheat',
        diet: 'lactose-free',
      },
      {
        name: 'Avocado Sandwich',
        toppings: [
          await Topping.findOne({ name: 'avocado' }),
          await Topping.findOne({ name: 'cucumber' }),
          await Topping.findOne({ name: 'tomato' }),
          await Topping.findOne({ name: 'lettuce' }),
          await Topping.findOne({ name: 'margarine' }),
        ],
        breadType: 'rye',
        diet: 'vegan',
      },
    ];

    const sandwichPromises = exampleSandwiches.map(async (sandwich) => {
      const newSandwich = new Sandwich(sandwich);
      await newSandwich.save();
    });

    await Promise.all(sandwichPromises);

    /**
    const exampleOrders = [
      {
        sandwichId: await Sandwich.findOne({ name: 'Lettuce and tomato' }),
        status: 'ordered',
      },
      {
        sandwichId: await Sandwich.findOne({ name: 'Tomato and cucumber' }),
        status: 'ready',
      },
    ];

    const orderPromises = exampleOrders.map(async (order) => {
      const newOrder = new Order(order);
      await newOrder.save();
    });

    await Promise.all(orderPromises);
    */

    console.log('Data seeded successfully');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { connectToDb, seedDb };