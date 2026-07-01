import Note from '../models/Note.js';

// Get all notes for the logged-in user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new note
export const createNote = async (req, res) => {
    try {
        const newNote = await Note.create({ ...req.body, userId: req.user.id });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};