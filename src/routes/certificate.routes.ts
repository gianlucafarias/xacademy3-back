import  { Router, RequestHandler } from 'express';
import { generateCertificate } from '../controllers/certificate.controller';

const router = Router();

router.post("/generar-certificado", generateCertificate as RequestHandler);

export default router;