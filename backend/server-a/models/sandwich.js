const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Topping = require('./topping');
  
// mongoose model for sandwich
const sandwichSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  toppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topping'
  }],
  breadType: {
    type: String,
    enum: ['white', 'rye', 'whole wheat'],
    required: true
  },
  diet: {
    type: String,
    enum: ['vegan', 'lactose-free']
  }
});

sandwichSchema.pre('save', async function(next) {
  try {
    const toppings = await Topping.find({ _id: { $in: this.toppings } });
    if (toppings.length !== this.toppings.length) {
      throw new mongoose.CastError('Topping not found', 'Topping not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

sandwichSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Stringify the mongodb ObjectId
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Sandwich = mongoose.model('Sandwich', sandwichSchema);

module.exports = Sandwich;