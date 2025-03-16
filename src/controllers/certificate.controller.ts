import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Certificate from "../models/Certificates";
import Student from "../models/Student";
import Courses from "../models/Courses";

export const generateCertificate = async (req: Request, res: Response) => {
    const { student_id, course_id, score, status } = req.body;

    try {
        // Verificar si el curso está finalizado y si el estudiante aprobó
        const course = await Certificate.findOne({
            where: {
                student_id,
                course_id,
                status: "FINALIZADO",
            },
            include: [
                {
                    model: Student,
                    as: "student",
                },
                {
                    model: Courses,
                    as: "courses",
                },
            ],
        });

        if (!course) {
            return res.status(400).json({ error: "El curso no está finalizado o el estudiante no aprobó el curso" });
        }

        // Generar el certificado
        const doc = new PDFDocument();
        const certificatePath = path.join(__dirname, '../../public/certificados', `${student_id}-${course_id}.pdf`);
        
        doc.pipe(fs.createWriteStream(certificatePath));

        // Personalizar contenido del certificado
        doc.image(path.join(__dirname, '../../public/LOGO.png'), 50, 50, { width: 100 });
        doc.fontSize(25).text('Certificado de Aprobación', 180, 150);
        doc.fontSize(15).text('Este certificado es otorgado a:', 50, 200);
        doc.fontSize(18).text('Nombre del Estudiante', 50, 230);
        doc.fontSize(15).text('Por haber completado el curso con éxito:', 50, 270);
        doc.fontSize(18).text('Nombre del Curso', 50, 300);
        doc.fontSize(12).text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 50, 340);
        
        // Agregar firma
        doc.image(path.join(__dirname, '../../public/SELLO.png'), 50, 380, { width: 100 });

        // Finalizar documento
        doc.end();

        // Cambiar estado del certificado a "EMITIDO"
        await course.update({ status: "EMITIDO" });

        // Devolver la ruta del certificado generado
        res.json({ message: "Certificado generado exitosamente", certificate: certificatePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error al generar el certificado" });
    }
};
