import { RequestHandler, Router } from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse } from '../controllers/course.controller';

const router = Router();

router.post('/create', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById as RequestHandler);
router.put('/:id', updateCourse as RequestHandler);

export default router;

