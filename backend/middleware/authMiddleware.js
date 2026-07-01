import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user ID to the request
        next(); // Proceed to the next controller
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};