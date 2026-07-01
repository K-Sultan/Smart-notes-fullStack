import express from 'express';
import { register, login } from '../controllers/authController.js'; // Import login

const router = express.Router();

router.post('/register', register);
router.post('/login', login); // Add this line

export default router;