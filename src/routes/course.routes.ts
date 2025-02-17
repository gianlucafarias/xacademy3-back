import { RequestHandler, Router } from 'express';
import { createCourse, createCourseCategory, editCourseCategory, getActiveCoursesCount, getAllActiveCourses, getAllCourseCategories, getAllCourses, getCourseByCategory, getCourseById, getCoursesByCategory, getCoursesBySearch, getCoursesCount, updateCourse } from '../controllers/course.controller';

const router = Router();

router.post('/create', createCourse as RequestHandler);
router.get('/', getAllCourses as RequestHandler);
router.get('/active', getAllActiveCourses as RequestHandler);
router.get('/view/:id', getCourseById as RequestHandler);
router.put('/update/:id', updateCourse as RequestHandler);
router.get('/categories/:category_id', getCourseByCategory as RequestHandler);
router.post('/categories/create', createCourseCategory as RequestHandler);
router.get('/categories', getAllCourseCategories as RequestHandler);
router.put('/categories/:id', editCourseCategory as RequestHandler);
router.get('/count', getCoursesCount as RequestHandler);
router.get('/category/:category_id', getCoursesByCategory as RequestHandler);
router.get('/search/:search', getCoursesBySearch as RequestHandler);
router.get('/active-count', getActiveCoursesCount as RequestHandler);


export default router;

