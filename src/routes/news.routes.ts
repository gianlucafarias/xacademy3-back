import { RequestHandler, Router } from 'express';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/news.controller';



const router = Router();

router.post('/', createNews as RequestHandler);
router.get('/', getAllNews as RequestHandler);
router.get('/:id', getNewsById as RequestHandler);
router.put('/:id', updateNews as RequestHandler);
router.delete('/:id', deleteNews as RequestHandler);

export default router;

