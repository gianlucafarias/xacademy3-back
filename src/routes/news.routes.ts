import { RequestHandler, Router } from 'express';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews, getOrderedNews } from '../controllers/news.controller';




const router = Router();

router.post('/', createNews as RequestHandler);
router.get('/', getAllNews as RequestHandler);
router.get('/view/:id', getNewsById as RequestHandler);
router.put('/:id', updateNews as RequestHandler);
router.delete('/:id', deleteNews as RequestHandler);
router.get('/ordered', getOrderedNews as RequestHandler);


export default router;

