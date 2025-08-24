// server.js

// Import necessary modules
const dgram = require('dgram'); // For UDP communication
const express = require('express'); // For creating the HTTP server
const cors = require('cors'); // For handling Cross-Origin Resource Sharing

// --- Configuration ---
const HTTP_PORT = 3001; // Port for the HTTP server
const UDP_PORT = 41234; // Port for the UDP server
const UDP_HOST = '127.0.0.1'; // Host for the UDP server (localhost)

// --- Express HTTP Server Setup ---
const app = express();

// Enable CORS for all origins, allowing the React app to communicate
app.use(cors());
// Parse JSON bodies for incoming requests
app.use(express.json());

// HTTP POST endpoint to send a UDP message
app.post('/send-udp-message', (req, res) => {
    const { message } = req.body; // Get the message from the request body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Create a new UDP socket for sending messages
    const client = dgram.createSocket('udp4');
    const buffer = Buffer.from(message); // Convert the string message to a Buffer

    // Send the message as a UDP packet
    client.send(buffer, UDP_PORT, UDP_HOST, (err) => {
        if (err) {
            console.error(`UDP send error: ${err}`);
            client.close(); // Close the client socket on error
            return res.status(500).json({ status: 'error', message: 'Failed to send UDP message' });
        } else {
            console.log(`Sent UDP message: "${message}" to ${UDP_HOST}:${UDP_PORT}`);
            client.close(); // Close the client socket after sending
            return res.status(200).json({ status: 'success', message: 'UDP message sent!' });
        }
    });
});

// Start the HTTP server
app.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT}`);
    console.log(`Access this server at http://localhost:${HTTP_PORT}`);
});

// --- UDP Server Setup ---
const server = dgram.createSocket('udp4'); // Create a UDP4 socket

// Event listener for when the UDP server is ready and listening
server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Event listener for when the UDP server receives a message
server.on('message', (msg, rinfo) => {
    // Log the received message and information about the sender
    console.log(`UDP Server received message from ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);
    // Optionally, send a response back to the sender
    // server.send(`Echo: ${msg}`, rinfo.port, rinfo.address, (err) => {
    //     if (err) console.error(`UDP echo error: ${err}`);
    // });
});

// Event listener for UDP server errors
server.on('error', (err) => {
    console.error(`UDP Server error: ${err.stack}`);
    server.close(); // Close the server socket on error
});

// Event listener for when the UDP server is closed
server.on('close', () => {
    console.log('UDP Server closed');
});

// Bind the UDP server to the specified port and host
server.bind(UDP_PORT, UDP_HOST);