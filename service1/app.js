const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to RabbitMQ server
const amqpServer = "amqp://localhost:5672";
let channel, connection;

async function connect() {
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("service1");
}

connect();

// Endpoint to receive messages from service2 and acknowledge them
app.post('/send', async (req, res) => {
    const { message } = req.body;
    await channel.sendToQueue("service2", Buffer.from(message));
    return res.json({ message: "Sent to service2" });
});

app.listen(port, () => {
    console.log(`Service1 listening at http://localhost:${port}`);
});
