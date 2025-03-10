import { RequestHandler, Router } from 'express';
import { getAllAssistByIdStudent , registerAttendance } from '../controllers/assist.controller';

const router = Router();

router.get('/view/:student_id', getAllAssistByIdStudent  as RequestHandler);
router.post('/register', registerAttendance as RequestHandler);


export default router;