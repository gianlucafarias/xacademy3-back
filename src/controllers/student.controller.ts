import { Request, Response } from "express";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import Class from "../models/Class";
import Assist from "../models/Assist";
import { AuthRequest } from "../middleware/authMiddleware";

//Mostrar todos los estudiantes
export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ['id', 'user_id'] },
    });
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    console.log('Error al obtener los estudiantes', error);
    res.status(500).json({ message: 'Error al obtener los estudiantes' });
  }
}

//Verifico si existe el estudiante
// const findStudentById = async (id: string) => {
//   return await Student.findByPk(id);
// };

export const findStudentById = async (student_id: string) => {
  try {
    const student = await Student.findByPk(student_id, {
      attributes: { exclude: ['id', 'user_id'] }, // Excluir los campos id y usuario_id
    });
    return student;
  } catch (error) {
    console.error('Error al buscar el estudiante:', error);
    throw new Error('Error al obtener el estudiante');
  }
};

//Mostrar estudiantes por id
export const getStudentById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    // Obtener el estudiante
    const student = await findStudentById(id);

    // Validar si se encontró el estudiante
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Devolver la información del estudiante
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
export const findConditionByStudentId = async (student_id: string)=>{
  try {
    const student = await Student.findByPk(student_id, {
      attributes: ["studentCondition"],

    });
    if (!student) {
      return null;
    }
    return student;
  } catch (error) {
    console.error("Error al obtener la condición del estudiante:", error);
    return null;
  }
}


export const getConditionByStudentId = async (req: Request, res: Response) => {

  const { student_id } = req.params;

    const studentCondition = await findConditionByStudentId(student_id);
    if (!studentCondition) {
        return res.status(404).json({ error: "No se encontró la condición del estudiante" });
    }

    res.json(studentCondition);

}

/**
 * Calcular el porcentaje de asistencias de un estudiante
 */
export const calculateAttendancePercentage = async (studentId: number) => {
  // Verifico si el estudiante existe
  const student = await findStudentById(studentId.toString());
  if (!student) {
    throw new Error("Estudiante no encontrado");
  }

  // Contar el total de clases registradas
  const totalClases = await Assist.count({
    where: { student_id: studentId },
  });

  if (totalClases === 0) {
    return {
      id: studentId,
      percentage: "0%",
      message: "El estudiante no tiene asistencia registrada",
      attended: 0,
      total: totalClases,
    };
  }

  // Contar las clases asistidas
  const attendedClases = await Assist.count({
    where: { student_id: studentId, attendance: 1 },
  });

  // Calcular el porcentaje
  const attendancePercentage = (attendedClases / totalClases) * 100;

  return {
    id: studentId,
    percentage: attendancePercentage.toFixed(2) + "%",
    attended: attendedClases,
    total: totalClases,
  };
};

/**
 * Verificar si la clase pertenece a un curso
 */
export const verifyClassBelongsToCourse = async (classId: number) => {
  const classData = await Class.findOne({
    where: { id: classId },
    attributes: ["id", "course_id"], // Solo los campos necesarios
  });

  if (!classData) {
    throw new Error("La clase no existe");
  }

  return classData.dataValues.course_id; // Retorna el curso al que pertenece la clase
};

/**
 * Endpoint para obtener el porcentaje de asistencia del estudiante
 */
export const getAttendancePercentage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    // Calcular el porcentaje de asistencia
    const result = await calculateAttendancePercentage(studentId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al calcular el porcentaje de asistencia:", error);
    res.status(500).json({
      error: "Error interno al procesar la solicitud",
    });
  }
};

/**
 * Data del estudiante
 */
export const getStudentWithUser = async (student_id: string) => {
  try {
    const student = await Student.findOne({
      where: { id: student_id },
      include: [
        {
          model: User,
          as: 'user', 
          attributes: ['name', 'lastname', 'dni']
        }
      ]
    });

    if (!student) {
      throw new Error('Estudiante no encontrado');
    }

    return student;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener los datos del estudiante');
  }
};
