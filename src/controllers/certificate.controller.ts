import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Certificate from "../models/Certificates";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import { findCourseById } from "./course.controller";
import { calculateAttendancePercentage, findConditionByStudentId, findStudentById, getStudentWithUser } from "./student.controller";
import { isStudentAlreadyEnrolled } from "./inscription.controller";

// Función para verificar si el estudiante está aprobado
const isStudentApproved = async (student_id: number) => {
    const condition = await findConditionByStudentId(student_id.toString());
    return condition && condition.dataValues.studentCondition === 'APROBADO';
};

// Función para verificar la asistencia
const isAttendanceSufficient = async (student_id: number) => {
    const correctAssistance = await calculateAttendancePercentage(student_id);
    const attendancePercentage = parseFloat(correctAssistance.percentage.toString());
    return attendancePercentage >= 80;
};

// Función para generar el PDF
const generatePDF = (student: any, course: any, student_id: number, course_id: number) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const certificateDir = path.join(__dirname, '../../public/certificados');

    // Verifica si la carpeta existe, si no, créala
    if (!fs.existsSync(certificateDir)) {
        fs.mkdirSync(certificateDir, { recursive: true });
    }

    const certificatePath = path.join(certificateDir, `${student_id}-${course_id}.pdf`);
    doc.pipe(fs.createWriteStream(certificatePath));

    const bgPath = path.join(__dirname, '../../public/bg.jpg');
    if (fs.existsSync(bgPath)) {
        doc.image(bgPath, 0, 0, { width: 842, height: 595 });
    }

    const logoPath = path.join(__dirname, '../../public/LOGO.png');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 620, 20, { width: 140 });
    }

    doc.font('Helvetica-Bold')
    .fontSize(38)
    .fillColor('#003366')
    .text('CERTIFICADO DE APROBACIÓN', 0, 140, { align: 'center' });

    // Verificar si student.user existe antes de acceder a sus propiedades
    if (!student || !student.dataValues || !student.dataValues.user) {
        doc.fontSize(20).fillColor('red').text("Error: Datos del estudiante no disponibles", { align: 'center' });
        doc.end();
        return certificatePath;
    }

    doc.moveDown(0.5);
    doc.fontSize(22).fillColor('black')
    .text(`Se certifica que:`, { align: 'center' })
    .moveDown(0.5)
    .font('Helvetica-Bold').fontSize(32)
    .text(`${student.dataValues.user.lastname} ${student.dataValues.user.name}`, { align: 'center' })
    .moveDown(0.5)
    .font('Helvetica').fontSize(22)
    .text(`Con DNI: ${student.dataValues.user.dni}`, { align: 'center' });

    // Verificar si el curso existe antes de acceder a sus propiedades
    if (!course || !course.dataValues) {
        doc.fontSize(20).fillColor('red').text("Error: Datos del curso no disponibles", { align: 'center' });
        doc.end();
        return certificatePath;
    }

    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(22)
    .text(`Ha completado exitosamente el curso:`, { align: 'center' })
    .moveDown(0.5)
    .font('Helvetica').fontSize(26).fillColor('#336699')
    .text(`${course.dataValues.title}`, { align: 'center' });

    doc.moveDown(1);
    doc.font('Helvetica').fontSize(18).fillColor('black')
    .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'center' });

    const selloPath = path.join(__dirname, '../../public/SELLO.png');
    if (fs.existsSync(selloPath)) {
        const selloX = 80; 
        const selloY = 420; 
            doc.image(selloPath, selloX, selloY, { width: 160 });
    }

    // Finalizar documento
    doc.end();

    return certificatePath;
};

// Función para guardar el certificado en la base de datos
const saveCertificate = async (student_id: number, course_id: number, certificatePath: string) => {
    await Certificate.create({
        student_id,
        course_id,
        status: "EMITIDO",
        issue_date: new Date(),
        path: certificatePath,
    });
};

// Función principal para generar el certificado
export const generateCertificate = async (req: Request, res: Response) => {
    try {
        const { student_id, course_id } = req.body;
        console.log(req.body);

        // Verificar que el alumno exista
        const student = await getStudentWithUser(student_id);
        console.log("Datos completos del estudiante:", student);

        if (!student) {
            return res.status(404).json({ error: 'El estudiante no existe en la base de datos' });
        }

        // Verificar que el curso exista
        const course = await findCourseById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'El curso no fue encontrado' });
        }

        // Verificar que el estudiante esté inscrito en el curso
        const enrollment = await isStudentAlreadyEnrolled(student_id, course_id);
        if (!enrollment) {
            return res.status(400).json({ error: 'El estudiante no está en este curso' });
        }

        // Verificar si el estudiante está aprobado
        if (!await isStudentApproved(student_id)) {
            return res.status(400).json({ message: 'El estudiante no está aprobado' });
        }

        // Verificar si la asistencia es suficiente
        if (!await isAttendanceSufficient(student_id)) {
            return res.status(400).json({ error: 'La asistencia no es la correcta' });
        }

        // Generar el certificado en PDF
        const certificatePath = generatePDF(student, course, student_id, course_id);

        // Guardar el certificado en la base de datos
        await saveCertificate(student_id, course_id, certificatePath);

        // Responder con éxito
        res.json({ message: "Certificado generado exitosamente", certificate: certificatePath });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error al generar el certificado" });
    }
};

export const getCerticateById = async (req: Request, res: Response) => {
    const student_id = req.params.student_id;
  
    try {
      const certificados = await Certificate.findAll({
        where: { student_id },
        include: [
          {
            model: Courses,
            as: 'course', 
            attributes: ['title'], 
          },
        ],
      });
  
      if (!certificados.length) {
        return res.status(404).json({ error: 'No se encontraron certificados para este estudiante' });
      }
  
      res.json({ certificados });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener los certificados' });
    }
  };