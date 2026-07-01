import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
// Load Environment Variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors());         // Enable Cross-Origin Resource Sharing

// Routes
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Root Health Check
app.get('/', (req, res) => {
    res.send('Smart Notes API is running!');
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit process if DB fails to connect
    });