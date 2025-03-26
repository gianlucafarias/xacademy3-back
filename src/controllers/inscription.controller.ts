import { Request, Response } from "express";
import Inscription from "../models/Inscription";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import Payment from "../models/Payment";
import { AuthRequest } from "../middleware/authMiddleware";
import { Model, Op } from "sequelize";
import { getStudentById } from "./student.controller";


/**
 * Mostrar todas las incripciones
 * @Response all incription
 */
export const getAllInscriptions = async (req: Request, res: Response) => {
    try {
      const inscriptions = await Inscription.findAll();
      res.status(200).json(inscriptions);
    } catch (error) { 
      res.status(500).json({ error: 'Error las incripciones' });
    }
  }

/**
 * Mostrar inscripciones por id de curso
 * @Request course_id
 * @Response incsriptions
 */
export const getInscriptionsByCourseId = async (req: Request, res: Response) => {
    const { course_id } = req.params;
    try {
        const inscriptions = await Inscription.findAll({
            where: {
                course_id,
            },
            include: [
                {
                    model: Student,
                    as: "student",
                    where: {
                        user_id: { [Op.col]: 'student.user_id' },
                        },
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["name","lastname", "dni", "phone", "birthday", "address", "email"],
                        }]
                         
                    
                }
            ]
        });
        if (!inscriptions) {
            return res.status(404).json({
                error: 'No se encontraron inscripciones para el curso'
            });
        }

        res.status(200).json(inscriptions);
    } catch (error) {
        console.error('Error al obtener las inscripciones por curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
/**
 * Mostrar inscripciones por id de studiante
 * @Request student_id
 * @Response inscription
 */

export const getInscriptionsByStudentId = async (req: AuthRequest, res: Response) => {
    const user = req.user;
    try {
        const student = await Student.findOne({
            where: { user_id: user.id },
            attributes: ['id']
        });
        
        if (!student) {
            return res.status(200).json([]);
        }

        const inscriptions =await Inscription.findAll({
            include:[
                {
                    model:Courses,
                    as:"course",
                    attributes:['id', 'title', 'image_url', 'startDate', 'price', 'endDate', 'modalidad']
                },
                {
                    model: Student, 
                    as: "student", 
                    where: {
                        user_id: user.id  
                    },
                    attributes: ['id'] 
                }
            ]
        });
        if(inscriptions.length === 0){
            return res.status(404).json({
                error:'No se encontraron inscripciones para el estudiante'
            })
        }
 
        res.status(200).json(inscriptions);
    } catch (error) {
        console.error('Error al obtener las inscripciones por estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor'});
    }
}

/**
 * Metodo para inscribir un estudiante a un curso
 * @param req user_id, course_id, birthday, dni, phone, address
 * @param res inscription 
 * @returns 
 */
export const enrollStudentInCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { course_id: courseId, birthday, dni, phone, address } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        // Validación de datos requeridos
        const validationError = validateRequestData(userId, courseId);
        if (validationError) {
            return res.status(404).json({ error: validationError });
        }
        //Verifico que exista cupo disponible
        if(!(await hasAviableQuota(courseId))){
            return res.status(404).json({
                error:'No hay cupo disponible'
            });
        }

        // Obtener o crear estudiante válido
        const student = await getValidStudent(userId, courseId, birthday, dni, phone, address);

        // Verificar si ya está inscrito
        if (await isStudentAlreadyEnrolled(student.getDataValue("id"), courseId)) {
            return res.status(404).json({ error: "Ya estás inscripto en este curso" });
        }

        // Inscribir al estudiante
        const inscription = await enrollStudent(student.getDataValue("id"), courseId);
        
        // Registrar el pago en estado "PENDIENTE"
        await registerPendingPayment(student.getDataValue("id"), courseId);

        //actulizo el cupo disponible
        await updateCourseQuota(courseId);

        res.status(201).json({ message: "Inscripción exitosa", inscription });
    } catch (error: any) {
        console.error("Error al inscribir al estudiante en el curso:", error);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};


export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const { dni, phone, birthday, address } = req.body;
    const userId = req.user?.id; // Obtener el ID del usuario autenticado

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updatedUser = await user.update({
      dni,
      phone,
      birthday,
      address,
    });

    return res.status(200).json({
      message: "Datos del usuario actualizados correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


/**
 * Valido que la solicitud contenga los datos requeridos
 */
const validateRequestData = (userId: number, courseId: number): string | null => {
    if (!userId || !courseId) {
        return "Faltan datos requeridos";
    }
    return null;
};

/**
 * Verifico que el usuario exista y sea estudiante
 */
const getValidStudent = async (userId: number, courseId: number, birthday: string, dni: number, phone: string, address: string) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("El usuario no fue encontrado");
    if (user.getDataValue("userRole") !== "STUDENT") throw new Error("El usuario no es un estudiante");

    let student = await Student.findOne({ 
        where: { user_id: userId } });

    if (!student) {
        student = await Student.create({ 
            user_id: userId, 
            course_id: courseId 
        });

        // Actualizar datos personales en User
        await User.update({ birthday, dni, phone, address }, { where: { id: userId } });
    }

    return student;
};


/**
 * Verifico si el estudiante ya está inscrito en el curso
 */
export const isStudentAlreadyEnrolled = async (studentId: number, courseId: number): Promise<boolean> => {
    const existingInscription = await Inscription.findOne({ where: { student_id: studentId, course_id: courseId } });
    return !!existingInscription;
};

/**
 * Verifico que exista cupo dispónible en el curso
 */
const hasAviableQuota = async(courseId: number):Promise<boolean> =>{
    const course = await Courses.findByPk(courseId);
    if(!course){
        throw new Error('El curso no se encontro');
    }
    return course.getDataValue('quota') > 0;
}
/**
 * Si hay cupo, debo actualizar el cupo disponible
 */
const updateCourseQuota =async(courseId: number)=>{
    const course =await Courses.findByPk(courseId);
    if(!course){
        throw new Error('El curso no se encontro');
    }
    const newQuota =course.getDataValue('quota') -1;
    if(newQuota< 0){
        throw new Error('No hay cupo disponible');
    }
    await Courses.update(
        {quota:newQuota},
        {where:{id:courseId}}
    
    )
}

/**
 * Inscribe al estudiante en el curso
 */
const enrollStudent = async (studentId: number, courseId: number) => {
    return await Inscription.create({ student_id: studentId, course_id: courseId });
};

/**
 * Registra un pago en estado "PENDIENTE" al inscribir al estudiante
 */
const registerPendingPayment = async (studentId: number, courseId: number) => {
    const existingPayment = await Payment.findOne({
        where: { student_id: studentId, course_id: courseId },
    });

    if (!existingPayment) {
        await Payment.create({
            student_id: studentId,
            course_id: courseId,
            price: 0, // Puedes poner el precio real si lo tienes
            status: "PENDIENTE",
        });
    }
};

export const getStudentByUserId = async (req: Request, res: Response) => {
    const userId = req.params.user_id;  
  
    try {
      const student = await Student.findOne({
        where: { user_id: userId }, 
        attributes: ['id', 'user_id', 'course_id', 'qualification', 'studentCondition']
      });
      
      if (student) {
        res.json({ student });  
      } else {
            res.status(200).json({ student: null });
        }
    } catch (err) {
      console.error('Error al obtener estudiante:', err);  
      res.status(500).json({ error: 'Error al obtener estudiante' });
    }
  };
  
  /**
 * Obtener el total de cursos inscritos por student_id
 * @Request student_id (desde el usuario autenticado)
 * @Response total de inscripciones
 */

export const getCountInscriptions = async (req: AuthRequest, res: Response) => {
    const user = req.user;
    try {
        const totalInscriptions = await Inscription.count({
            include: [
                {
                    model: Student,
                    as: "student",
                    where: {
                        user_id: user.id
                    }
                }
            ]
        });

        res.status(200).json({ total: totalInscriptions });
    } catch (error) {
        console.error('Error al obtener el total de inscripciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

    

