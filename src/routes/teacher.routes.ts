import { RequestHandler, Router } from 'express';
import { createTeacher, getAllTeachers, getTeacherById, getTeacherCount, updateTeacher } from '../controllers/teacher.controller';

const router = Router();

router.post('/create', createTeacher as RequestHandler);
router.get('/all', getAllTeachers as RequestHandler);
router.get('/view/:id', getTeacherById as RequestHandler);
router.put('/update/:id', updateTeacher as RequestHandler);
router.get('/count', getTeacherCount as RequestHandler);

export default router;