import  { Router, RequestHandler } from 'express';
import { checkAndGenerateCertificates, downloadCertificate, generateCertificate, getCerticateById, } from '../controllers/certificate.controller';

const router = Router();
router.post("/generate", generateCertificate as RequestHandler);

// Descargar certificado específico (GET)
router.get('/download/:id', downloadCertificate as RequestHandler);

// Obtener certificados por estudiante (GET)
router.get('/student/:student_id', getCerticateById as RequestHandler);

//chequea el certificado
router.get('/check/:studen_id/:course_id', checkAndGenerateCertificates as RequestHandler);


export default router;