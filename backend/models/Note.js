import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    category: String,
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
    isPinned: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);