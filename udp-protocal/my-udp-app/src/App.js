// App.js
import React, { useState } from 'react';

// Main App component
const App = () => {
    // State to hold the message typed by the user
    const [message, setMessage] = useState('');
    // State to hold the response received from the Node.js HTTP server
    const [response, setResponse] = useState('');
    // State to manage loading indicator during API call
    const [loading, setLoading] = useState(false);
    // State to hold any error messages
    const [error, setError] = useState('');

    // Function to handle sending the message to the Node.js server
    const sendMessage = async () => {
        setLoading(true); // Set loading to true
        setError(''); // Clear previous errors
        setResponse(''); // Clear previous responses

        try {
            // Make a POST request to the Node.js HTTP server
            const res = await fetch('http://localhost:3001/send-udp-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }), // Send the message in JSON format
            });

            // Parse the JSON response
            const data = await res.json();

            if (res.ok) {
                // If the response is successful, update the response state
                setResponse(data.message);
                setMessage(''); // Clear the input field
            } else {
                // If there's an error, update the error state
                setError(data.error || 'Something went wrong on the server.');
            }
        } catch (err) {
            // Catch network errors or other unexpected issues
            console.error('Error sending message:', err);
            setError('Could not connect to the Node.js server.');
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    UDP Message Sender
                </h1>

                {/* Input field for the message */}
                <div className="mb-4">
                    <label htmlFor="messageInput" className="block text-gray-700 text-sm font-semibold mb-2">
                        Message to send:
                    </label>
                    <input
                        id="messageInput"
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                </div>

                {/* Button to send the message */}
                <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()} // Disable button if loading or message is empty
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105
                                disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending...' : 'Send UDP Message'}
                </button>

                {/* Display server response or error */}
                {(response || error) && (
                    <div className="mt-6 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 text-blue-800 shadow-md">
                        <p className="font-semibold mb-1">Server Response:</p>
                        {response && <p className="text-green-700">{response}</p>}
                        {error && <p className="text-red-700">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

