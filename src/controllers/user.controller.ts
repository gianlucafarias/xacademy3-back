import { Request, Response } from 'express';
import User from '../models/User';

interface UserData {
    name: string;
    lastname: string;
    dni: number;
    phone: string;
    address: string;
    birthday: Date;
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, lastname, dni, phone, address, birthDate } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData: Partial<UserData> = {};
        
        if (name !== undefined) userData.name = name;
        if (lastname !== undefined) userData.lastname = lastname;
        if (dni !== undefined) userData.dni = typeof dni === 'string' ? parseInt(dni, 10) : dni;
        if (phone !== undefined) userData.phone = phone;
        if (address !== undefined) userData.address = address;
        if (birthDate !== undefined) userData.birthday = birthDate;

        await user.update(userData);
        const updatedUser = await User.findByPk(id);
        res.status(200).json({ message: 'Información actualizada correctamente', user: updatedUser });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar la información', error });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Usuario encontrado', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la información', error });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ message: 'Información encontrada correctamente', users });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la información', error });
    }
}

export const findUserById = async (userId: number) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    throw new Error('Error al obtener el usuario');
  }
};