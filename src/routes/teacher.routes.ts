import { RequestHandler, Router } from 'express';
import { createTeacher, getAllTeachers, getTeacherById, getTeacherCount, updateTeacher, assignTeacherRoleToUser, getTeacherByUserId, getOrderedTeachers } from '../controllers/teacher.controller';

const router = Router();

router.post('/create', createTeacher as RequestHandler);
router.get('/all', getAllTeachers as RequestHandler);
router.get('/view/:id', getTeacherById as RequestHandler);
router.put('/update/:id', updateTeacher as RequestHandler);
router.get('/count', getTeacherCount as RequestHandler);
router.post('/assign-role', assignTeacherRoleToUser as RequestHandler);
router.get('/user/:user_id', getTeacherByUserId as RequestHandler);
router.get('/ordered', getOrderedTeachers as RequestHandler);

export default router;