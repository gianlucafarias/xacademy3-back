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


//verifico si ya se emitio el certificado
const isCertificateAlreadyIssued=async(student_id:number, course_id:number)=>{
    const existingCertificate = await Certificate.findOne({
        where: {
            student_id,
            course_id,
            status: "EMITIDO"
        }
    })
    return existingCertificate !==null;
}
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
    const doc = new PDFDocument();
    const certificateDir = path.join(__dirname, '../../public/certificados');

    // Verifica si la carpeta existe, si no, créala
    if (!fs.existsSync(certificateDir)) {
        fs.mkdirSync(certificateDir, { recursive: true });
    }

    const certificatePath = path.join(certificateDir, `${student_id}-${course_id}.pdf`);
    doc.pipe(fs.createWriteStream(certificatePath));

    // Personalizar contenido del certificado con los datos reales
    doc.fontSize(25).text('Certificado de Aprobación', 180, 150);
    doc.fontSize(25).text('Alumno:', 25, 200);

    // Verificar si student.user existe antes de acceder a sus propiedades
    if (student.dataValues.user) {
        doc.fontSize(18).text(`${student.dataValues.user.lastname} ${student.dataValues.user.name}`, 18, 230);
        doc.fontSize(25).text('Con DNI:', 25, 260);
        doc.fontSize(18).text(`${student.dataValues.user.dni}`, 18, 280);
    } else {
        doc.fontSize(18).text('Datos del alumno no disponibles', 25, 230);
    }

    doc.fontSize(15).text('Por haber completado el curso con éxito:', 25, 310);
    doc.fontSize(18).text(`${course.dataValues.title}`, 18, 340);
    doc.fontSize(12).text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 15, 370);

    // Agregar firma
    doc.image(path.join(__dirname, '../../public/SELLO.png'), 50, 380, { width: 100 });

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
        
        //verificar si ya se emitio un certificado al estudiante
        if(await isCertificateAlreadyIssued(student_id, course_id)){
            return res.status(400).json({error:"Ya se emitio un certificado al estudiante"});
        }

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