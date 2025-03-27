import { Router, RequestHandler } from 'express';
import { editUser, getAllUsers, getUser } from '../controllers/user.controller';

const router = Router();

router.put('/:id', editUser as RequestHandler);
router.get('/:id', getUser as RequestHandler);
router.get('/', getAllUsers as RequestHandler);

export default router;
