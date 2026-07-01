import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Smart Notes API is running!');
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log('Database connection error:', err));