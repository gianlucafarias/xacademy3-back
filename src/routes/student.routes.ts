import { RequestHandler, Router } from "express";
import {  assignFinalGrade, getAllStudents, getAttendancePercentage, getConditionByStudentId, getStudentById, updateStudentGrade } from "../controllers/student.controller";

const router = Router();

router.get('/', getAllStudents as RequestHandler);
router.get('/view/:id', getStudentById as RequestHandler);
router.post('/qualify/:id', assignFinalGrade  as RequestHandler);
router.put('/update-grade/:id', updateStudentGrade as RequestHandler);
router.get('/condition/:id', getConditionByStudentId as RequestHandler);
router.get('/:id/attendance', getAttendancePercentage as RequestHandler)
export default router;