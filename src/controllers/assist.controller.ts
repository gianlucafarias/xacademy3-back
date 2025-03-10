import { Request, Response } from 'express';
import Assist from '../models/Assist';
import Class from '../models/Class';
import Student from '../models/Student';
import User from '../models/User';


/**
 * Obtengo todas las asistencia de un estudiante
 * @Response all assist
 */

export const getAllAssistByIdStudent = async (req: Request, res: Response) => {
    try {

        const { student_id } = req.params;

        if (!student_id) {
            return res.status(400).json({ error: "student_id es obligatorio en la URL" });
        }

        // Verifica si el estudiante existe
        const student = await Student.findByPk(student_id,{
            include:{
                model:User,
                as:"user",
                attributes:['name', 'lastname']
            }
        });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

         // Obtiene las asistencias del estudiante
         const assistance = await Assist.findAll({
            where: { student_id },
        });

        res.status(200).json({
            student_id,
            nombre: student.dataValues.user_id.name, 
            apellido: student.dataValues.user_id.lastname,
            assistance
        });

    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        res.status(500).json({ error: "Error al obtener las asistencias" });
    }
};


/**
 * Registrar la asistencia de un estudiante a una clase
 */
export const registerAttendance = async (req: Request, res: Response) => {
    try {
        const { class_id, student_id, attendance} = req.body;
        //verificar si la clase existe
        const classExists = await Class.findByPk(class_id);
        if(!classExists){
            return res.status(404).json({
                error:'Clase no encontrada'
            });
        }
        //Verifica si el estudiante existe
        const studentExists= await Student.findByPk(student_id);
        if(!studentExists){
            return res.status(404).json({ 
                message: "estudiante no encontrado" 
            });        
        }
        //Registrar asistencia
        const newAsist = await Assist.create({
            class_id, 
            student_id, 
            attendance,
        });
        res.status(201).json({
            message:"Asistencia registrada con éxito",
            asistencia: newAsist,
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error al registrar la asistencia'
        });
    }
}

