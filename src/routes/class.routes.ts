import { RequestHandler, Router } from 'express';
import {getClassesByStudent, getClassCountByCourse, createClass, getClassesByCourse } from '../controllers/class.controller';

const router = Router();

router.post('/newclase', createClass as RequestHandler);
router.get('/count/:courseId', getClassCountByCourse as RequestHandler);
router.get('/course/:courseId', getClassesByCourse as RequestHandler);
router.get('/totalClasses/:studentId', getClassesByStudent as RequestHandler);


export default router;