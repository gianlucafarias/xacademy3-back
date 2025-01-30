import { Router, RequestHandler } from 'express';
import { login, register, resetPassword } from '../controllers/auth.controller';

const router = Router();


router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);


export default router;