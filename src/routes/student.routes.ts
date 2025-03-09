import { RequestHandler, Router } from "express";
import { getAllStudents, getStudentById } from "../controllers/student.controller";

const router = Router();

router.get('/', getAllStudents as RequestHandler);
router.get('/view/:id', getStudentById as RequestHandler);

export default router;