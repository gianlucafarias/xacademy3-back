import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { auth } from '../../config/firebase';
import { Op } from 'sequelize';
import exp from 'constants';
import { AuthRequest } from '../middleware/authMiddleware';
import Inscription from '../models/Inscription';
import Student from '../models/Student';

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

const generateTokens = (userId: number) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Buscar el usuario en la base de datos local
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.dataValues.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar tokens
        const tokens = generateTokens(user.dataValues.id);
        
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.dataValues.id,
                email: user.dataValues.email,
                name: user.dataValues.name,
                lastname: user.dataValues.lastname,
                role: user.dataValues.userRole
            },
            ...tokens
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error al iniciar sesión', 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, lastname, email, password } = req.body as RegisterRequest;
    if (!name || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {
        // Verificar si el usuario ya existe en Firebase
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe en Firebase' });
        }

        // Verificar si el usuario existe en la base de datos local
        const localUser = await User.findOne({ where: { email } });
        if (localUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Crear usuario en Firebase
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: `${name} ${lastname}`,
        });

        // Almacenar el usuario en tu base de datos
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            uuid: userRecord.uid, // Guardamos el uid de Firebase como uuid
            name,
            lastname,
            email,
            password: hashedPassword,
            userRole: 'STUDENT'
        });

        // Generar tokens
        const tokens = generateTokens(user.dataValues.id);
        
        // Generar token de Firebase
        const firebaseToken = await auth.createCustomToken(userRecord.uid);
        
        res.status(201).json({
            message: 'Usuario creado con éxito',
            user: {
                id: user.dataValues.id,
                email: user.dataValues.email,
                name: user.dataValues.name,
                lastname: user.dataValues.lastname,
                role: user.dataValues.userRole
            },
            firebaseToken,
            ...tokens
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ 
            message: 'Error al crear el usuario', 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        // Obtener el refresh token del header
        const refreshToken = req.headers.authorization?.split(' ')[1];
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token no proporcionado' });
        }

        try {
            // Verificar el refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { id: number };
            
            // Buscar el usuario
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Generar nuevos tokens
            const tokens = generateTokens(user.dataValues.id);

            res.status(200).json({
                message: 'Token refrescado exitosamente',
                ...tokens
            });
        } catch (error) {
            return res.status(401).json({ message: 'Refresh token inválido o expirado' });
        }
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        res.status(500).json({ message: 'Error al refrescar el token', error });
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

export const registerWithFirebase = async (req: Request, res: Response) => {
    console.log('Recibida petición de registro social:', req.body);
    
    const { uuid, email, name } = req.body;

    if (!uuid || !email) {
        console.log('Faltan campos requeridos:', { uuid, email, name });
        return res.status(400).json({ 
            message: 'UUID y email son requeridos',
            received: { uuid, email, name }
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [{ email }] 
            } 
        });

        if (existingUser) {
            // Si el usuario existe, generamos tokens
            const tokens = generateTokens(existingUser.dataValues.id);
            return res.status(200).json({ 
                message: 'Usuario existente, login exitoso',
                user: {
                    id: existingUser.dataValues.id,
                    email: existingUser.dataValues.email,
                    name: existingUser.dataValues.name,
                    lastname: existingUser.dataValues.lastname,
                    role: existingUser.dataValues.userRole
                },
                ...tokens
            });
        }

        // Procesar el nombre completo
        let firstName = 'Usuario';
        let lastName = 'Social';

        if (name) {
            const nameParts = name.trim().split(/\s+/);
            if (nameParts.length >= 2) {
                firstName = nameParts[0];
                lastName = nameParts.slice(1).join(' ');
            } else if (nameParts.length === 1) {
                firstName = nameParts[0];
            }
        }

        // Crear nuevo usuario
        const newUser = await User.create({ 
            email, 
            name: firstName,
            lastname: lastName,
            uuid: uuid,
            userRole: 'STUDENT'
        });

        // Generar tokens
        const tokens = generateTokens(newUser.dataValues.id);

        return res.status(201).json({ 
            message: 'Usuario registrado con éxito',
            user: {
                id: newUser.dataValues.id,
                email: newUser.dataValues.email,
                name: newUser.dataValues.name,
                lastname: newUser.dataValues.lastname,
                role: newUser.dataValues.userRole
            },
            ...tokens
        });

    } catch (error) {
        console.error('Error en registerWithFirebase:', error);
        return res.status(500).json({ 
            message: 'Error al procesar la solicitud',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers.authorization?.split(' ')[1];
        if (!refreshToken) {
            return res.status(401).json({ message: 'No se proporcionó un token de refresco' });

        }
        return res.status(200).json({ message: 'Cierre de sesión exitoso' });
        
    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({ 
            message: 'Error al cerrar sesión',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const getUserCount = async (req: Request, res: Response) => {
    try {
        const userCount = await User.count();
        res.status(200).json(userCount);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el conteo de usuarios' });
    }
}

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(400).json({ message: "Usuario no autenticado" });
        }

        const me = await User.findOne({
            attributes: ['id', 'birthday', 'address', 'dni', 'phone'], 
            where: { id: user.id }
        });

        if (!me) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(me);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
    }

    const { name, lastname, dni, phone, address, birthday } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    await user.update({
        name,
        lastname,
        dni,
        phone,
        address,
        birthday
    });

    const updatedUser = await User.findByPk(userId, {
        attributes: ['id', 'name', 'lastname', 'dni', 'phone', 'address', 'birthday']
    });

    res.status(200).json({
        message: "Perfil actualizado con éxito",
        user: updatedUser
    });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: "Error al actualizar el perfil" });
    }
};


