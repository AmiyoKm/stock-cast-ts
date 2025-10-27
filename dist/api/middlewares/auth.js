import jwt from 'jsonwebtoken';
import { UserService } from '../../services/users/index.js';
const userService = new UserService();
export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.get(parseInt(decoded.sub, 10));
        req.user = user;
    }
    catch (error) {
        req.user = null;
    }
    next();
};
export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};
export const requireActivatedUser = (req, res, next) => {
    if (!req.user || !req.user.activated) {
        return res.status(403).json({ message: 'User not activated' });
    }
    next();
};
