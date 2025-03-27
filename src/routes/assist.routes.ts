import { RequestHandler, Router } from 'express';
import { getAllAssistByIdStudent , getAssistByClassId, registerAttendance } from '../controllers/assist.controller';

const router = Router();

router.get('/view/:student_id', getAllAssistByIdStudent  as RequestHandler);
router.post('/register', registerAttendance as RequestHandler);
router.get('/class/:class_id', getAssistByClassId as RequestHandler);

export default router;