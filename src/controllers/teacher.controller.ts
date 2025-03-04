import { Request, Response } from 'express';
import Teacher from '../models/Teacher';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { auth } from '../../config/firebase';
import Courses from '../models/Courses';
export const createTeacher = async (req: Request, res: Response) => {
    const {
        name,
        lastname,
        email,
        password,
        phone,
        specialty
    } = req.body;

    try {
        // Validar campos requeridos
        if (!name || !lastname || !email || !password || !specialty) {
            return res.status(400).json({ error: 'Los campos nombre, apellido, email, contraseña y especialidad son requeridos' });
        }

        // Verificar si el email ya está registrado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear usuario en Firebase
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: `${name} ${lastname}`,
        });

        // Crear usuario en la base de datos local
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            uuid: userRecord.uid,
            name,
            lastname,
            email,
            phone,
            password: hashedPassword,
            userRole: 'TEACHER'
        });

        // Crear profesor
        const teacher = await Teacher.create({
            user_id: user.dataValues.id,
            specialty
        });

        // Obtener el profesor con los datos del usuario
        const teacherWithUser = await Teacher.findByPk(teacher.dataValues.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
        });

        res.status(201).json({
            message: 'Profesor creado exitosamente',
            teacher: teacherWithUser
        });

    } catch (error) {
        console.error('Error al crear profesor:', error);
        res.status(500).json({
            error: 'Error al crear el profesor',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getAllTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await Teacher.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
        });

        res.status(200).json(teachers);
    
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
};

export const getTeacherById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findByPk(id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }
        ]
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        const courses = await Courses.findAll({
            where: {
                teacher_id: teacher.dataValues.id
            }
        });

        res.status(200).json({ teacher, courses });
    } catch (error) {
        console.error('Error al obtener profesor:', error);
        res.status(500).json({ error: 'Error al obtener el profesor' });
    }
};

export const updateTeacher = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        name,
        lastname,
        dni,
        phone,
        address,
        birthday,
        specialty
    } = req.body;

    try {
        const teacher = await Teacher.findByPk(id, {
            include: [{
                model: User,
                as: 'user'
            }]
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        // Actualizar datos del usuario
        await teacher.getDataValue('user').update({
            name,
            lastname,
            dni,
            phone,
            address,
            birthday
        });

        // Actualizar especialidad del profesor
        await teacher.update({ specialty });

        // Obtener el profesor actualizado
        const updatedTeacher = await Teacher.findByPk(id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
        });

        res.status(200).json({
            message: 'Profesor actualizado exitosamente',
            teacher: updatedTeacher
        });
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        res.status(500).json({ error: 'Error al actualizar el profesor' });
    }
};

export const getTeacherCount = async (req: Request, res: Response) => {
    try {
        const teacherCount = await Teacher.count();
        res.status(200).json(teacherCount);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el conteo de profesores' });
    }
}

export const assignTeacherRoleToUser = async (req: Request, res: Response) => {
    const { email, specialty } = req.body;
    
    try {
        // Validar campos requeridos
        if (!email || !specialty) {
            return res.status(400).json({ error: 'El correo y la especialidad son requeridos' });
        }

        // Buscar el usuario por correo
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ya es profesor
        if (user.dataValues.userRole === 'TEACHER') {
            return res.status(400).json({ error: 'El usuario ya tiene rol de profesor' });
        }

        // Verificar si ya existe entrada en la tabla teacher para este usuario
        const existingTeacher = await Teacher.findOne({ where: { user_id: user.dataValues.id } });
        
        if (existingTeacher) {
            return res.status(400).json({ error: 'El usuario ya está registrado como profesor' });
        }

        // Actualizar el rol del usuario a TEACHER
        await user.update({ userRole: 'TEACHER' });

        // Crear la entrada en la tabla teacher
        const teacher = await Teacher.create({
            user_id: user.dataValues.id,
            specialty
        });

        // Obtener el profesor con los datos del usuario
        const teacherWithUser = await Teacher.findByPk(teacher.dataValues.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
        });

        res.status(200).json({ 
            message: 'Rol de profesor asignado exitosamente', 
            teacher: teacherWithUser 
        });
        
    } catch (error) {
        console.error('Error al asignar rol de profesor:', error);
        res.status(500).json({ error: 'Error al asignar el rol de profesor al usuario' });
    }
}

