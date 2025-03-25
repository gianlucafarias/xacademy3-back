import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Certificate from "../models/Certificates";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import { findCourseById } from "./course.controller";
import { calculateAttendancePercentageByCourse, findConditionByStudentId, findStudentById, getStudentWithUser } from "./student.controller";
import { isStudentAlreadyEnrolled } from "./inscription.controller";


//verifico si ya se emitio el certificado
const isCertificateAlreadyIssued = async (student_id: number, course_id: number) => {
    return await Certificate.findOne({
        where: {
            student_id,
            course_id,
            status: "EMITIDO"
        }
    });
}
// Función para verificar si el estudiante está aprobado
const isStudentApproved = async (student_id: number) => {
    const condition = await findConditionByStudentId(student_id.toString());
    return condition && condition.dataValues.studentCondition === 'APROBADO';
};

// Función para verificar la asistencia
const isAttendanceSufficient = async (student_id: number, course_id: number) => {
    const correctAssistance = await calculateAttendancePercentageByCourse(student_id, course_id);
    const attendancePercentage = parseFloat(correctAssistance.percentage.toString());
    return attendancePercentage >= 80;
};

// Función para generar el PDF
const generatePDF = (student: any, course: any, filePath: string) => {
    return new Promise<void>((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", layout: "landscape" });

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);


        const resourcesPath = path.resolve(__dirname, "../../public");
        const images = {
            bg: path.join(resourcesPath, "bg.jpg"),
            logo: path.join(resourcesPath, "LOGO.png"),
            sello: path.join(resourcesPath, "SELLO.png"),
        };

        // Agregar la imagen de fondo
        if (images.bg) {
            doc.image(images.bg, 0, 0, { width: 842, height: 595 });
        }
        // Agregar el logo
        if (images.logo) {
            doc.image(images.logo, 620, 20, { width: 140 });
        }

        // Título del certificado
        doc.font("Helvetica-Bold").fontSize(38).fillColor("#003366").text("CERTIFICADO DE APROBACIÓN", 0, 140, { align: "center" });

        if (!student?.dataValues?.user) {
            return renderError(doc, "Datos del estudiante no disponibles");
        }

        const { user } = student.dataValues;

        doc.moveDown(0.5).fontSize(22).fillColor("black").text(`Se certifica que:`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica-Bold").fontSize(32).text(`${user.lastname} ${user.name}`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica").fontSize(22).text(`Con DNI: ${user.dni}`, { align: "center" });

        if (!course?.dataValues) {
            return renderError(doc, "Datos del curso no disponibles");
        }

        doc.moveDown(1).font("Helvetica-Bold").fontSize(22).text(`Ha completado exitosamente el curso:`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica").fontSize(26).fillColor("#336699").text(`${course.dataValues.title}`, { align: "center" });

        doc.moveDown(1).font("Helvetica").fontSize(18).fillColor("black").text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: "center" });

        if (fs.existsSync(images.sello)) doc.image(images.sello, 80, 420, { width: 160 });

        doc.end();
        writeStream.on('finish', () => {
            resolve();
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });  
};



// Función principal para generar el certificado
export const generateCertificate = async (req: Request, res: Response) => {
    try {
        const { student_id, course_id } = req.body;

        const existingCertificate = await isCertificateAlreadyIssued(student_id, course_id);

        if (existingCertificate) {
            console.log('existe', existingCertificate);
            if (existingCertificate.dataValues.file_path) {
                console.log("Ruta del archivo existente:", existingCertificate.dataValues.file_path);
                if (fs.existsSync(existingCertificate.dataValues.file_path)) {
                    return res.download(existingCertificate.dataValues.file_path);
                } else {
                    return res.status(404).send("Archivo no encontrado en la ruta especificada.");
                }
            }
            return res.status(400).json({ error: "Ya se emitió un certificado, pero no tiene una ruta de archivo almacenada." });
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
        if (!await isAttendanceSufficient(student_id, course_id)) {
            return res.status(400).json({ error: 'La asistencia no es la correcta' });
        }
        const certificatesPath = path.join(__dirname, '../../certificates');
        if (!fs.existsSync(certificatesPath)) fs.mkdirSync(certificatesPath);

        const fileName = `Certificado_${student_id}_${course_id}.pdf`;
        const filePath = path.join(certificatesPath, fileName);

        await generatePDF(student, course, filePath);

        await Certificate.create({
            student_id,
            course_id,
            status: "EMITIDO",
            issue_date: new Date(),
            file_path: filePath,
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.download(filePath, fileName);

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send("Error interno del servidor");
        }
    }
};

function renderError(doc: PDFKit.PDFDocument, arg1: string) {
    throw new Error("Function not implemented.");
}
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