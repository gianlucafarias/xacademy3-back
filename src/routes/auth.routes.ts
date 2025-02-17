import { Router, RequestHandler } from 'express';
import { login, register, resetPassword, refreshToken, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);
router.post('/refresh-token', refreshToken as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler);

export default router;