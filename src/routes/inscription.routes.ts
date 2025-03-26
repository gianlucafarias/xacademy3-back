import { RequestHandler, Router } from "express";
import { updateUserData, enrollStudentInCourse, getAllInscriptions, getInscriptionsByCourseId,
     getInscriptionsByStudentId, getStudentByUserId,
     getCountInscriptions,
     getMonthlyStats} from "../controllers/inscription.controller";

import verifyToken  from "../middleware/authMiddleware";

const router = Router();
router.get('/', getAllInscriptions as RequestHandler);
router.post("/enroll",  verifyToken, enrollStudentInCourse as RequestHandler);
router.get('/view', verifyToken, getInscriptionsByStudentId as RequestHandler)
router.put('/update', verifyToken, updateUserData as RequestHandler);
router.get('/courses/:course_id', getInscriptionsByCourseId as RequestHandler);
router.get('/student/:user_id', getStudentByUserId as RequestHandler);
router.get('/countInscriptions', verifyToken, getCountInscriptions as RequestHandler);
router.get('/monthly-stats', getMonthlyStats as RequestHandler);


export default router;