import { Request, Response } from "express";
import Payment from "../models/Payment";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";

/**
 * Muestro todos los pagos
 */
export const getAllPayments = async (req: Request, res: Response) => {
    try {
      const payments = await Payment.findAll();
      res.status(200).json(payments);
    } catch (error) { 
      res.status(500).json({ error: 'Error al obtener todos los pagos' });
    }
  }

  /**
   * Mostrar pagos por id 
   */
  export const getPaymentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el pago' });
    }
  }
  /**
   * Mostrar Pagos realizado por un estudiante estudiante
   */
  export const getPaymentsByStudentId = async (req: Request, res: Response) => {
    const { student_id } = req.params;
    try {
      //busco los pagos del estudiante
      const payments = await Payment.findAll({
        where: { student_id },
      });
      if(payments.length === 0){
        return res.status(404).json({ 
            error: 'No se encontraron pagos para el estudiante' 
        });
      }
      res.status(200).json(payments);

    } catch (error) {
        console.error('Error al obtener los pagos por estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  /**
   * Obtener pago segun su estado(PAGADO, PENDIENTE, RECHAZADO)
   */
  export const getPaymentsByStatus = async (req: Request, res: Response) => {
    const { status } = req.params;
    try {
        //Buscar los pagos con el estado solicitado
        const payments = await Payment.findAll({
            where: { status },
        });
        if(payments.length === 0){
            return res.status(404).json({ 
                error: 'No se encontraron pagos con el estado solicitado' 
            });
        }
        res.status(200).json({payments});
    } catch (error) {
        console.error('Error al obtener los pagos', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

/**
 * Registro el pago del curso
 */
export const registerPayment = async (req: Request, res: Response) => {
  try {
      const { student_id: studentId, course_id: courseId } = req.body;
      
      // Verifico si ya existe un pago registrado para este estudiante y curso
      const existingPayment = await findPaymentByStudentAndCourse(studentId, courseId);

      // Verifico si el estudiante existe
      const student = await findStudentById(studentId);
      if (!student) {
          return res.status(404).json({ error: "Estudiante no encontrado" });
      }

      // Verifico si el curso existe
      const course = await Courses.findByPk(courseId);
      if (!course) {
         return res.status(404).json({ error: "Curso no encontrado" });
      }

      // Obtener el precio del curso
      const price = parseFloat(course.get('price') as string);  // Convierto a número si es un string

      if (isNaN(price)) {
          return res.status(400).json({ error: "El precio del curso no es válido" });
      }

      // Verifico si el pago ya está registrado y si el estado es 'PAGADO'
      if (existingPayment && existingPayment.get('status') === 'PAGADO') {
          return res.status(400).json({ message: "El estudiante ya tiene un pago registrado y procesado." });
}

      // Si no está pagado, registro el nuevo pago
      const newPayment = await createPayment(studentId, courseId, price);  

      // Actualizo el estado de pago del estudiante
      await updateStudentPaymentStatus(student);

      res.status(201).json({
          message: "Pago registrado exitosamente",
          payment: newPayment,
      });

  } catch (error) {
      console.error("Error al registrar el pago:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Verifico si un estudiante existe en la base de datos
 */
const findStudentById = async (studentId: number) => {
    return await Student.findByPk(studentId);
};
/**
 * Verifico si ya existe un pago registrado para el estudiante y el curso
 */
const findPaymentByStudentAndCourse = async (studentId: number, courseId: number) => {
    return await Payment.findOne({
        where: { student_id: studentId, course_id: courseId },
    });
};

/**
 * Registro un nuevo pago en la base de datos
 */
const createPayment = async (studentId: number, courseId: number, price: number) => {
    return await Payment.update({
        student_id: studentId,
        course_id: courseId,
        price,
        status: "PAGADO",
    },
    {
    where: { student_id: studentId, course_id: courseId }
    }
  );
};



/**
 * Actualizo el estado de pago del estudiante
 */
const updateStudentPaymentStatus = async (student: any) => {
    await student.update({ payment_status: "PAGADO" });
};

export const getPaymentsByStudentIdAndStatus = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  const { status } = req.query; 

  try {
    if (!status) {
      return res.status(400).json({ error: 'El estado de pago es obligatorio (PAGADO, PENDIENTE)' });
    }

    
    const payments = await Payment.findAll({
      where: {
        student_id, 
        status, 
      },
    });

    if (payments.length === 0) {
      return res.status(200).json({ payments: [] }); 
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error al obtener los pagos por estudiante y estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener estado del pago de un curso para un estudiante
 */
export const getCoursePaymentStatus = async (req: Request, res: Response) => {
  const { student_id, course_id } = req.params;

  try {
    // Buscar el pago del estudiante para este curso
    const payment = await Payment.findOne({
      where: {
        student_id: student_id,
        course_id: course_id,
      },
    });

    // Si no se encontró un pago, el estado es "Pendiente"
    if (!payment) {
      return res.status(200).json({ status: "PENDIENTE" });
    }

    // Si se encontró un pago, devolver el estado
    return res.status(200).json({ status: "PAGADO" });
  } catch (error) {
    console.error("Error al obtener el estado del pago:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getCountPendingPayments = async (req: Request, res: Response) => {
  const { student_id } = req.params;

  try {
    const totalPendingPayments = await Payment.count({
      where: {
        student_id,
        status: 'PENDIENTE',
      },
    });

    res.status(200).json({ total: totalPendingPayments });
  } catch (error) {
    console.error('Error al obtener el total de pagos pendientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOrderedPayments = async (req: Request, res: Response) => {
  try {
    const { orderBy, direction, student_id, status, page = 1, limit = 10 } = req.query;

    let orderClause: any = [['id', 'ASC']];
    const offset = (Number(page) - 1) * Number(limit);

    // Construir el where con student_id y status
    const where: any = {};
    if (student_id) where.student_id = student_id;
    if (status) where.status = status;

    if (orderBy && typeof orderBy === 'string') {
      const dir = direction && (direction as string).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      if (orderBy === 'courses') {
        orderClause = [[
          { model: Courses, as: 'courses' },
          'title',
          dir
        ]];
      }
      else if (orderBy === 'student') {
        orderClause = [[
          { model: Student, as: 'student' },
          { model: User, as: 'user' },
          'name',
          dir
        ]];
      }
      else if (isValidColumn(orderBy)) {
        orderClause = [[orderBy, dir]];
      }
    }

    const { count, rows } = await Payment.findAndCountAll({
      where: where, // Usar el where construido con ambos filtros
      order: orderClause,
      limit: Number(limit),
      offset: offset,
      include: [
        {
          model: Courses,
          as: 'courses',
          attributes: ['id', 'title', 'price']
        },
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'lastname', 'email']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      payments: rows,
      totalItems: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      hasNextPage: Number(page) < Math.ceil(count / Number(limit)),
      hasPreviousPage: Number(page) > 1
    });

  } catch (error) {
    console.error('Error al obtener los pagos ordenados:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ 
      error: 'Error al obtener los pagos ordenados',
      details: errorMessage
    });
  }
};

function isValidColumn(column: string): boolean {
  const allowedColumns = [
    'id', 
    'student_id', 
    'course_id', 
    'price', 
    'status',
    'payment_method',
    'createdAt',
    'updatedAt'
  ];
  return allowedColumns.includes(column);
}
