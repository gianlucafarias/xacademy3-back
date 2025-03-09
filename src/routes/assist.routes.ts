import { RequestHandler, Router } from 'express';
import { getAllAssistByIdCurse } from '../controllers/assist.controller';

const router = Router();

router.get('/assitance/:course_id', getAllAssistByIdCurse as RequestHandler);



export default router;