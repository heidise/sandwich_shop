const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  sandwichId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sandwich',
    required: true
  },
  status: {
    type: String,
    enum: ['ordered', 'received', 'inQueue', 'ready', 'failed'],
    default: 'ordered'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

// Configure return object so that it matches the .yaml file
orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Stringify the mongodb ObjectId
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;