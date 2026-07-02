import express from 'express';
import { getNotes, createNote, updateNote, deleteNote, getNoteById } from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes below require authentication

router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNoteById).patch(updateNote).delete(deleteNote);

export default router;