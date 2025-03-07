import { RequestHandler, Router } from "express";
import {updateUserData, enrollStudentInCourse, getAllInscriptions, getInscriptionsByCourseId, getInscriptionsByStudentId } from "../controllers/inscription.controller";
import verifyToken  from "../middleware/authMiddleware";

const router = Router();
router.get('/', getAllInscriptions as RequestHandler);
router.post("/enroll",  verifyToken, enrollStudentInCourse as RequestHandler);
router.get('/view', verifyToken, getInscriptionsByStudentId as RequestHandler)
router.put('/update', verifyToken, updateUserData as RequestHandler);
router.get('/courses/:course_id', getInscriptionsByCourseId as RequestHandler);
export default router;