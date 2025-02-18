import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        res.locals.user = { id: decoded.id }; // Puedes agregar más información si es necesario
        next(); // Llama a next() para continuar con la siguiente función de middleware
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export default authMiddleware;