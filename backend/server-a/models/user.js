const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('./order.js');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

// Configure return object so that it matches the .yaml file
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Stringify the mongodb ObjectId
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;