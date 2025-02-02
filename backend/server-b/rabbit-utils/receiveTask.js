#!/usr/bin/env node
// Process tasks from the work queue
// in our case an order for a sandwich

'use strict';

const sendTask = require('./sendTask.js')

var amqp = require('amqplib');

module.exports.getTask = function(rabbitHost, queueName){
  amqp.connect('amqp://' + rabbitHost).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(queueName, {durable: true});
      ok = ok.then(function() { ch.prefetch(1); });
      ok = ok.then(function() {
        ch.consume(queueName, doWork, {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
      });
      return ok;

      function doWork(msg) {
        var body = msg.content.toString();
        var order = JSON.parse(body);
        console.log(" [x] Received '%s'", body);
        var delay = 5; // in seconds
        console.log(" [x] Task takes %d seconds", delay);
        // Change order status to "received"
        order.status = "received";
        sendTask.addTask("rapid-runner-rabbit", "message-queue-B", order);
        setTimeout(function() {
          console.log(" [x] Done");
          ch.ack(msg);
          // Change order status to "ready"
          order.status = "ready";
          sendTask.addTask("rapid-runner-rabbit", "message-queue-B", order);
        }, delay*1000);
      }
    });
  }).catch(console.warn);
}
