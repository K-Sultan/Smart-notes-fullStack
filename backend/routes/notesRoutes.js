import { protect } from '../middleware/authMiddleware.js';

// Now this route is protected!
router.get('/', protect, getNotes);