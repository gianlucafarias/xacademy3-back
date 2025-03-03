import { Request, Response } from "express";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";

//Mostrar todos los estudiantes
export const getAllStudents = async(req:Request, res:Response)=>{
    try{
        const students = await Student.findAll();
        console.log(students);
        res.status(200).json(students);
    }catch(error){
        console.error(error);
        console.log('Error al obtener los estudiantes', error);
        res.status(500).json({message: 'Error al obtener los estudiantes'});
    }
}

//Mostrar estudiantes por id
export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
}


  
  
