const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toppingSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

toppingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Stringify the mongodb ObjectId
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
  
const Topping = mongoose.model('Topping', toppingSchema);

module.exports = Topping;