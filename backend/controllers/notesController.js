import Note from '../models/Note.js';

// Get all notes for the logged-in user
export const getNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const category = req.query.category || '';

        const query = { userId: req.user.id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const totalNotes = await Note.countDocuments(query);
        const notes = await Note.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            notes,
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        res.status(200).json(note);
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
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Prevent changing the userId
        delete req.body.userId;

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all unique categories for a user
export const getCategories = async (req, res) => {
    try {
        const categories = await Note.distinct('category', { userId: req.user.id });
        res.status(200).json(categories.filter(Boolean));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};