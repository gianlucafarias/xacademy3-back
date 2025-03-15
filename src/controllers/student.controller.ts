import { Request, Response } from "express";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import Class from "../models/Class";
import Assist from "../models/Assist";

//Mostrar todos los estudiantes
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.findAll();
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    console.log('Error al obtener los estudiantes', error);
    res.status(500).json({ message: 'Error al obtener los estudiantes' });
  }
}

//Verifico si existe el estudiante
const findStudentById = async (id: string) => {
  return await Student.findByPk(id);
};

//Mostrar estudiantes por id
export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const student = findStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
}

/**
 * Calificar un alumno;
 * @param req 
 * @param res 
 */
export const assignFinalGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Falta el ID del estudiante en los parámetros" });
      return;
    }

    const { qualification } = req.body;

    if (!validateQualification(qualification)) {
      res.status(400).json({ message: "La calificación debe estar entre 0 y 10" });
      return;
    }

    const student = await findStudentById(id);
    if (!student) {
      res.status(404).json({ error: "Alumno no encontrado" });
      return;
    }
    //Verifico si tiene pago el curso
    if (student.dataValues("status") !== "PAGADO") {
      res.status(403).json({ message: "No se puede calificar porque el estudiante no ha pagado." });
      return;
    }

    const studentCondition = getStudentCondition(qualification);

    await Student.update(
      { qualification, studentCondition },
      { where: { id: id } }
    );

    const updatedStudent = await findStudentById(id);

    res.status(200).json({ message: "Calificación asignada correctamente", student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la calificación" });
  }
};


// valido la calificacion
const validateQualification = (qualification: any): boolean => {
  return typeof qualification === "number" && qualification >= 0 && qualification <= 10;
};
//condicion del estudiante
const getStudentCondition = (qualification: number): string => {
  return qualification >= 7 ? "APROBADO" : "DESAPROBADO";
};

/**
 * Metodo para actualizar una calificacion de un estudiante
 */
export const updateStudentGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
  
    // Verificar que el ID del estudiante está presente
    if (!id) {
      res.status(400).json({ error: "Falta el ID del estudiante en los parámetros" });
      return;
    }
    const { qualification } = req.body;
    // Validar la calificación
    if (!validateQualification(qualification)) {
      res.status(400).json({ message: "La calificación debe estar entre 0 y 10" });
      return;
    }

    // Buscar el estudiante
    const student = await Student.findByPk(id);
    if (!student) {
      res.status(404).json({ error: "Alumno no encontrado" });
      return;
    }

    // Solo actualizar calificación y estado
    await Student.update(
      { 
        qualification, 
        studentCondition: getStudentCondition(qualification) 
      },
      { where: { id: id } }
    );

    // Obtener el estudiante actualizado
    const updatedStudent = await Student.findByPk(id);

    res.status(200).json({ message: "Calificación actualizada correctamente", student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la calificación" });
  }
};

export const getConditionByStudentId = async (req: Request, res: Response) => {
 
    try{
      const {id} = req.params;

      const student = await Student.findByPk(id,{
        attributes:["studentCondition"],
      });
      if(!student){
        return res.status(404).json({
          error:"Estudiante no encontrado"
        });
      }
      res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:"Error al obtener la condicion del estudiante"
    });

  }
  
}

/**
 * Obtener el porcentaje de asistencias de un estudiante
 */

export const getAttendancePercentage =async(req:Request, res:Response)=>{
  try {
    const {id} =req.params;
    const studentId = parseInt(id, 10);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    //verifico el estudiante
    const student = findStudentById(id);
    if(!student){
      return res.status(404).json({
        message:"El estudiante no encontrado"
      });
    }
    //contar el total de las clases que el estudiante asistio
    const totalClases = await Assist.count({
      where:{student_id:id}
    });

    if(totalClases === 0){
      return res.status(200).json({
        id, percentage:0,
        message:"El estudiante no tiene asistencia registrada"
      });
    }
    //cuento la cantidad de clases que el estudiante asistio
    const attendedClases= await Assist.count({
      where:{student_id: studentId, attendance: 1}
    });
    // Depuración
    console.log("Total Clases:", totalClases);
    console.log("Clases Asistidas:", attendedClases);
    //calculo el porcentaje

  const attendancePercentage = (attendedClases / totalClases)*100;

  res.status(200).json({
    id, 
    percentage: attendancePercentage.toFixed(2) + "%",
    attended:attendedClases,
    total: totalClases
  });


  } catch (error) {
    console.error("El error al obtener el porcentaje de asistencia", error);
    res.status(500).json({
      error:"Error al obtener los porcentajes"
    });
  }
}

