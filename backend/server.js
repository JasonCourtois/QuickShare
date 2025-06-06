require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');

// Initialize express app - use app to modify route, cors, middleware
const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

// Middleware setup
app.use(cors());
app.use(express.json());

// Route setup
const testRoute = require('./routes/testing');
app.use('/api/test', testRoute);
const sessionRoute = require('./routes/session');
app.use('/api/', sessionRoute);

// MongoDB options - Use stable API version 1 and warn about use of deprecated features
const mongooseOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true}};

async function startServer () {
    try {
        await mongoose.connect(uri, mongooseOptions);
        console.log("Connected to database");
        
        // HTTP Server built with node - handles the http requests
        const server = http.createServer(app); 

        // Websocket request inside express server
        const io = new Server(server, {
            cors: {
                // TODO: Change the origin on prod once we have a frontend domain secured.
                origin: '*',
                methods: ['GET', 'POST']
            }
        })

        // Handle websocket connection
        io.on('connection', (socket) => {
            console.log('A user connected', socket.id);

            // sessionId is the actual session ID for file uploads. We use the session Id as the socket.io room codes.
            socket.on('join_session', (sessionId) => {
                socket.join(sessionId);
                console.log(`Socket ${socket.id} joined the session ${sessionId}`);
            })

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected`);
            })
        })

        // Store websocket io object with key io
        app.set('io', io);

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

startServer();