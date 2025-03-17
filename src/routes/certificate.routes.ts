import  { Router, RequestHandler } from 'express';
import { generateCertificate, getCerticateById  } from '../controllers/certificate.controller';

const router = Router();

router.post("/generar-certificado", generateCertificate as RequestHandler);
router.get('/view/:student_id', getCerticateById as RequestHandler );

export default router;