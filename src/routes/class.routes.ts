import { RequestHandler, Router } from 'express';
import { getClassCountByCourse, createClass, getClassesByCourse } from '../controllers/class.controller';

const router = Router();

router.post('/newclase', createClass as RequestHandler);
router.get('/count/:courseId', getClassCountByCourse as RequestHandler);
router.get('/course/:courseId', getClassesByCourse as RequestHandler);

export default router;