#!/usr/bin/env node

const amqp = require('amqplib');

const queue = 'queue.name';

(async () => {
  try {
    const connection = await amqp.connect('amqp://username:password@localhost:5672/vhost');
    const channel = await connection.createChannel();

    process.once('SIGINT', async () => { 
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue);

    var totalMessageCount = 0;
    await channel.consume(queue, (message) => {
      totalMessageCount++;
      console.log(" [-] Message received timestamp: %s", new Date().toString());
      console.log(" [-] Total received Message count: %s", totalMessageCount);
      console.log(" [x] Received '%s'", message.content.toString());
    }, {
      noAck: true
    });

    console.log(' [*] Waiting for messages. To exit press CTRL+C');
  } catch (err) {
    console.warn(err);
  }
})();
