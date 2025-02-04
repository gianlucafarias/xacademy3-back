import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequest;
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {

        // verificar datos
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // verificar contraseña
        const isPasswordCorrect = await bcrypt.compare(password, user.dataValues.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // crear token
        const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, lastname, email, password } = req.body as RegisterRequest;
    if (!req.body.name || !req.body.lastname || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {

        // verificar datos
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // crear usuario
        const user = await User.create({ name, lastname, email, password: hashedPassword });

        // crear token
        const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Usuario creado con exito', token });
    } catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};


export const resetPassword = async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {  
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if(oldPassword === newPassword){
        return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.dataValues.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al resetear la contraseña', error });
    }
};


