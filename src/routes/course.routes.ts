import { RequestHandler, Router } from 'express';
import { createCourse, createCourseCategory, editCourseCategory, getActiveCoursesCount, getAllActiveCourses, getAllCourseCategories, getAllCourses, getCourseByCategory, getCourseById, getCoursesByCategory, getCoursesBySearch, getCoursesCount, getFilteredCourses, updateCourse, getCategoryById, changeCourseActive, lastestCourses } from '../controllers/course.controller';
import verifyToken  from "../middleware/authMiddleware";
const router = Router();

router.post('/create', verifyToken, createCourse as RequestHandler);
router.get('/', getAllCourses as RequestHandler);
router.get('/active', getAllActiveCourses as RequestHandler);
router.get('/view/:id', getCourseById as RequestHandler);
router.put('/update/:id', verifyToken, updateCourse as RequestHandler);
router.get('/categories/:category_id', getCourseByCategory as RequestHandler);
router.post('/categories/create', createCourseCategory as RequestHandler);
router.get('/categories', getAllCourseCategories as RequestHandler);
router.put('/categories/:id', editCourseCategory as RequestHandler);
router.get('/count', getCoursesCount as RequestHandler);
router.get('/category/:category_id', getCoursesByCategory as RequestHandler);
router.get('/search/:search', getCoursesBySearch as RequestHandler);
router.get('/active-count', getActiveCoursesCount as RequestHandler);
router.get('/filter', getFilteredCourses as RequestHandler);
router.get('/categories/view/:id', getCategoryById as RequestHandler);
router.put('/active/:id', changeCourseActive as RequestHandler);
router.get('/lastest', lastestCourses as RequestHandler);
export default router;

