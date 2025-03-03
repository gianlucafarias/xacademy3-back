import { Request, Response } from "express";
import Payment from "../models/Payment";
import Student from "../models/Student";
import Courses from "../models/Courses";

/**
 * Muestro todos los pagos
 */
export const getAllPayments = async (req: Request, res: Response) => {
    try {
      const payments = await Payment.findAll();
      res.status(200).json(payments);
    } catch (error) { 
      console.log(error)
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
        const { student_id: studentId, course_id: courseId, price } = req.body;

        // Verifico si el estudiante existe
        const student = await findStudentById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }

        // Verifico si el pago ya está registrado
        if (await isPaymentRegistered(studentId, courseId)) {
            return res.status(400).json({ message: "El estudiante ya tiene un pago registrado." });
        }

        // Registro el pago
        const newPayment = await createPayment(studentId, courseId, price);

        // Actualizo estado de pago del estudiante
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
const isPaymentRegistered = async (studentId: number, courseId: number) => {
    const payments = await Payment.findAll({
        where: { student_id: studentId, course_id: courseId },
    });
    return payments.length > 0;
};
/**
 * Registro un nuevo pago en la base de datos
 */
const createPayment = async (studentId: number, courseId: number, price: number) => {
    return await Payment.create({
        student_id: studentId,
        course_id: courseId,
        price,
        status: "PAGADO",
    });
};

/**
 * Actualizo el estado de pago del estudiante
 */
const updateStudentPaymentStatus = async (student: any) => {
    await student.update({ payment_status: "PAGADO" });
};
