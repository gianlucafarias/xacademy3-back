import  { Router, RequestHandler } from 'express';
import { downloadCertificate, generateCertificate, getCerticateById, } from '../controllers/certificate.controller';

const router = Router();
router.post("/", generateCertificate as RequestHandler);

// Descargar certificado específico (GET)
router.get('/download/:id', downloadCertificate as RequestHandler);

// Obtener certificados por estudiante (GET)
router.get('/student/:student_id', getCerticateById as RequestHandler);


export default router;