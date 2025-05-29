require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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
app.use('/api/session', sessionRoute);

// MongoDB options - Use stable API version 1 and warn about use of deprecated features
const mongooseOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true}};

async function startServer () {
    try {
        await mongoose.connect(uri, mongooseOptions);
        console.log("Connected to database");
        app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

startServer();