import { RequestHandler, Router } from "express";
import { enrollStudentInCourse, getAllInscriptions, getInscriptionsByCourseId, getInscriptionsByStudentId } from "../controllers/inscription.controller";

const router = Router();
router.get('/', getAllInscriptions as RequestHandler);
router.post("/enroll", enrollStudentInCourse as RequestHandler);
router.get('/:student_id', getInscriptionsByStudentId as RequestHandler)
router.get('/courses/:course_id', getInscriptionsByCourseId as RequestHandler);
export default router;