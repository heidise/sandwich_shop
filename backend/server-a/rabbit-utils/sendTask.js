#!/usr/bin/env node
// Post a new task to the work queue
// in our case an order for a sandwich

'use strict';

var amqp = require('amqplib');

const Order = require('../models/order.js');

module.exports.addTask = function(rabbitHost, queueName, order){
  amqp.connect('amqp://' + rabbitHost)
  .then(function(c) {
    c.createConfirmChannel()
    .then(function(ch) {
      ch.sendToQueue(queueName, new Buffer.from(JSON.stringify(order)), {},
      function(err, ok) {
        if (err !== null) {
          console.warn(new Date(), 'Message nacked!');
          // Change order status to "failed"
          Order.findByIdAndUpdate(order.id, { status: 'failed' }, { new: true })
            .then(updatedOrder => {
              console.log('Order status changed to "failed"');
            })
            .catch(err => {
              console.error('Error changing order status to "failed"');
            });
        }
        else {
          console.log(new Date(), 'Message acked');
          // Change order status to "inQueue"
          Order.findByIdAndUpdate(order.id, { status: 'inQueue' }, { new: true })
            .then(updatedOrder => {
              console.log('Order status changed to "inQueue"');
            })
            .catch(err => {
              console.error('Error changing order status to "inQueue"');
            });
        }
      });
    });
  });
}
