const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3001;

app.use(express.json());

// Connect to RabbitMQ server
const amqpServer = "amqp://localhost:5672";
let channel, connection;

async function connect() {
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("service2");

    // Consume messages from RabbitMQ
    channel.consume("service2", (data) => {
        console.log(`Received message from service1: ${data.content.toString()}`);
        channel.ack(data);
    });
}

connect();

app.listen(port, () => {
    console.log(`Service2 listening at http://localhost:${port}`);
});
