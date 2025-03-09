import { Request, Response } from 'express';
import Assist from '../models/Assist';
import Courses from '../models/Courses';
import Student from '../models/Student';

/**
 * Obtengo todas las asistencia de un curso
 * @Response all assist
 */

export const getAllAssistByIdCurse = async (req: Request, res: Response) => {
    const {course_id}=req.params;
    try {
        const assistance = await Assist.findAll({
            where:{
                course_id
            },
            include:[{
                model:Student,
                as: "student"
            }]
        });
        if(!assistance){
            return res.status(404).json({
                error:'No se encontraron asistencias para este curso'
            });
        }else{
            res.status(200).json(assistance);
        }

    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).json({
            error: 'Error al obtener las asistencias'
        });
        
    }
}



