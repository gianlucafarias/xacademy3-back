import { RequestHandler, Router } from "express";
import {getCoursePaymentStatus, getPaymentsByStudentIdAndStatus, getAllPayments, getPaymentById, registerPayment } from "../controllers/payment.controller";

const router = Router();
router.get('/', getAllPayments as RequestHandler);
router.post('/pay', registerPayment as RequestHandler);
router.get('/view/:id', getPaymentById as RequestHandler);
router.get('/student/:student_id', getPaymentById as RequestHandler);
router.get('/status/:status', getPaymentById as RequestHandler);
router.get('/statusandstudent/:student_id', getPaymentsByStudentIdAndStatus as RequestHandler);
router.get('/statusgeneral/:student_id/:course_id', getCoursePaymentStatus as RequestHandler);

export default router;