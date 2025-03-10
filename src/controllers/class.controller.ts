import { Request, Response } from 'express';
import Courses from '../models/Courses';
import Class from '../models/Class';

/**
 * Registro una nueva clase
 */
export const createClass = async (req: Request, res: Response) => {
    try {
        console.log("Body recibido:", req.body); 

        const { topic, class_date, course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ message: "course_id es obligatorio" });
        }

        const courseExists = await Courses.findByPk(course_id);
        if (!courseExists) {
            return res.status(404).json({ message: "El curso no existe" });
        }

        const newClass = await Class.create({
            course_id,
            topic,
            class_date
        });

        res.status(201).json({
            message: "Clase registrada correctamente",
            class: newClass
        });

    } catch (error) {
        console.error("Error al registrar la clase:", error); 
        res.status(500).json({
            message: "Error al registrar la clase",
            error
        });
    }
};
/**
 * Contar la cantidad de clases de un curso
 */
export const getClassCountByCourse = async (req: Request, res: Response) => {
    const {courseId} = req.params;
    try{
        const total =await Class.count({
            where:{
                course_id:courseId
            }
        });
        res.status(200).json({
            course_id:courseId,
            total_clases:total});
    }catch(error){
        res.status(500).json({
            message:"Error al contar las clases",
            error
        });
    }
}

/**
 * Mostrar las clases de un curso
 */
export const getClassesByCourse = async (req: Request, res: Response) => {
    const {courseId} = req.params;
    try{
        const clases = await Class.findAll({
            where:{
                course_id:courseId
            }
        });
        res.status(200).json({
            course_id:courseId,
            clases});
    }catch(error){
        res.status(500).json({
            message:"Error al mostrar las clases",
            error
        });
    }
}

