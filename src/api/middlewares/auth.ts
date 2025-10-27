import { type NextFunction, type Request, type Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { UserService } from '../../services/users/index.ts';

const userService = new UserService();

interface CustomJwtPayload extends JwtPayload {
    sub: string;
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret
        ) as CustomJwtPayload;
        const user = await userService.get(parseInt(decoded.sub, 10));

        req.user = user;
    } catch (error) {
        req.user = null;
    }

    next();
};

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};

export const requireActivatedUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || !req.user.activated) {
        return res.status(403).json({ message: 'User not activated' });
    }
    next();
};
