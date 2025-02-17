import { RequestHandler, Router } from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse } from '../controllers/course.controller';

const router = Router();

router.post('/create', createCourse as RequestHandler);
router.get('/', getAllCourses as RequestHandler);
router.get('/:id', getCourseById as RequestHandler);
router.put('/:id', updateCourse as RequestHandler);

export default router;

