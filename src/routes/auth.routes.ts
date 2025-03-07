import { Router, RequestHandler } from 'express';
import { login, register, resetPassword, refreshToken, logout, getUserCount, registerWithFirebase, getMe } from '../controllers/auth.controller';
import verifyToken  from "../middleware/authMiddleware";


const router = Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);
router.post('/refresh-token', refreshToken as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler);
router.get('/users/count', getUserCount as RequestHandler);
router.post('/login-social', registerWithFirebase as any);
router.get('/me', verifyToken , getMe as RequestHandler);

export default router;