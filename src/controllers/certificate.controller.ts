import { Request, Response } from "express";
import fs from 'fs';
import fsPromises, { access, mkdir, unlink } from 'fs/promises';
import path from 'path';
import PDFDocument from 'pdfkit';
import Certificate from "../models/Certificates";
import Student from "../models/Student";
import Courses from "../models/Courses";
import User from "../models/User";
import { findCourseById } from "./course.controller";
import { calculateAttendancePercentageByCourse, findConditionByStudentId, findStudentById, getStudentWithUser } from "./student.controller";
import { isStudentAlreadyEnrolled } from "./inscription.controller";

const CERTIFICATES_DIR = path.join(__dirname, '../../certificates');
const RESOURCES_DIR = path.resolve(__dirname, "../../public");

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
    return condition?.dataValues?.studentCondition === 'APROBADO';
};

// Función para verificar la asistencia(minimo 80%)
// Función para verificar la asistencia (mínimo 80%) por curso
const isAttendanceSufficient = async (student_id: number, course_id: number): Promise<boolean> => {
    try {
        const attendance = await calculateAttendancePercentageByCourse(student_id, course_id);

        // Extraer el valor numérico del porcentaje (eliminando el símbolo %)
        const percentageValue = parseFloat(attendance.percentage.replace('%', ''));

        return percentageValue >= 80;
    } catch (error) {
        console.error('Error al calcular asistencia:', error);

        // Puedes manejar el error de diferentes formas:
        // 1. Lanzar el error para que lo maneje el llamador
        throw error;

        // O 2. Retornar false y registrar el error
        // return false;
    }
};

// Crear directorio si no existe
const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
    try {
        await access(dirPath);
    } catch (error) {
        // Verificación de tipo segura
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            await mkdir(dirPath, { recursive: true });
        } else if (error instanceof Error) {
            throw error; // Relanza otros errores
        } else {
            throw new Error('Error desconocido al verificar directorio');
        }
    }
};
const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }

};

// Función para generar el PDF
const generatePDF = async (student: any, course: any, filePath: string) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    try {
        // Cargar imágenes
        const bgExists = await fileExists(path.join(RESOURCES_DIR, "bg.jpg"));
        const logoExists = await fileExists(path.join(RESOURCES_DIR, "LOGO.png"));
        const selloExists = await fileExists(path.join(RESOURCES_DIR, "SELLO.png"));

        // Agregar elementos al PDF
        if (bgExists) {
            doc.image(path.join(RESOURCES_DIR, "bg.jpg"), 0, 0, { width: 842, height: 595 });
        }

        if (logoExists) {
            doc.image(path.join(RESOURCES_DIR, "LOGO.png"), 620, 20, { width: 140 });
        }

        // Título
        doc.font("Helvetica-Bold").fontSize(38).fillColor("#003366")
            .text("CERTIFICADO DE APROBACIÓN", 0, 140, { align: "center" });

        if (!student?.dataValues?.user) {
            throw new Error("Datos del estudiante no disponibles");
        }

        const { user } = student.dataValues;

        // Datos del estudiante
        doc.moveDown(0.5).fontSize(22).fillColor("black")
            .text(`Se certifica que:`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica-Bold").fontSize(32)
            .text(`${user.lastname} ${user.name}`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica").fontSize(22)
            .text(`Con DNI: ${user.dni}`, { align: "center" });

        if (!course?.dataValues) {
            throw new Error("Datos del curso no disponibles");
        }

        // Datos del curso
        doc.moveDown(1).font("Helvetica-Bold").fontSize(22)
            .text(`Ha completado exitosamente el curso:`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica").fontSize(26).fillColor("#336699")
            .text(`${course.dataValues.title}`, { align: "center" });

        // Fecha
        doc.moveDown(1).font("Helvetica").fontSize(18).fillColor("black")
            .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: "center" });

        // Sello
        if (selloExists) {
            doc.image(path.join(RESOURCES_DIR, "SELLO.png"), 80, 420, { width: 160 });
        }

        doc.end();

        // Esperar a que se termine de escribir el archivo
        await new Promise<void>((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

    } catch (error) {
        writeStream.close();
        try {
            await unlink(filePath); // Versión correcta con promesas
        } catch (unlinkError) {
            console.error('Error al eliminar archivo temporal:', unlinkError);
        }
        throw error;
    };
}

export const generateCertificate = async (req: Request, res: Response) => {
    try {
        const { student_id, course_id } = req.body;

        // Validación básica reutilizando tus funciones
        if (!student_id || !course_id) {
            return res.status(400).json({
                error: "Se requieren student_id y course_id",
                code: "MISSING_REQUIRED_FIELDS"
            });
        }

        // Verificar si el certificado ya existe (usando tu función existente)
        const existingCert = await isCertificateAlreadyIssued(student_id, course_id);

        // Si existe y tiene archivo, devolverlo (usando tu función fileExists)
        if (existingCert?.dataValues?.file_path && await fileExists(existingCert.dataValues.file_path)) {
            return res.download(
                existingCert.dataValues.file_path,
                `Certificado_${student_id}_${course_id}.pdf`
            );
        }

        // Validar requisitos del estudiante (usando tus funciones existentes)
        const [student, course, enrolled, approved, attendanceOk] = await Promise.all([
            getStudentWithUser(student_id),
            findCourseById(course_id),
            isStudentAlreadyEnrolled(Number(student_id), Number(course_id)),
            isStudentApproved(student_id),
            isAttendanceSufficient(student_id, course_id)
        ]);

        if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
        if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
        if (!enrolled) return res.status(400).json({ error: 'Estudiante no inscrito en este curso' });
        if (!approved) return res.status(400).json({ error: 'Estudiante no aprobado' });
        if (!attendanceOk) return res.status(400).json({ error: 'Asistencia insuficiente (mínimo 80%)' });

        // Crear directorio (usando tu función ensureDirectoryExists)
        await ensureDirectoryExists(CERTIFICATES_DIR);
        const fileName = `Certificado_${student_id}_${course_id}_${Date.now()}.pdf`;
        const filePath = path.join(CERTIFICATES_DIR, fileName);

        // Generar PDF (usando tu función generatePDF)
        await generatePDF(student, course, filePath);

        // Guardar en base de datos (usando tu modelo Certificate)
        const certificado = existingCert || await Certificate.create({
            student_id,
            course_id,
            status: "EMITIDO",
            issue_date: new Date(),
            file_path: filePath,
        });

        // Si existía pero no tenía archivo, actualizarlo
        if (existingCert && !existingCert.dataValues.file_path) {
            await existingCert.update({ file_path: filePath });
        }

        // Stream el archivo al cliente (usando tu misma lógica)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('Stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({
                    error: "Error al enviar el archivo",
                    code: "STREAM_ERROR"
                });
            }
        });

    } catch (error) {
        console.error('[Certificate Error]', error);

        if (!res.headersSent) {
            const statusCode = error instanceof Error && error.name === 'ValidationError' ? 400 : 500;
            res.status(statusCode).json({
                error: "Error al procesar certificado",
                code: "PROCESSING_ERROR",
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
};

export const downloadCertificate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const certificado = await Certificate.findByPk(id);

        if (!certificado) {
            return res.status(404).json({
                error: 'Certificado no encontrado',
                code: "CERTIFICATE_NOT_FOUND"
            });
        }

        const filePath = certificado.dataValues.file_path;
        if (!filePath || !(await fileExists(filePath))) {
            return res.status(404).json({
                error: 'Archivo de certificado no disponible',
                code: "FILE_NOT_AVAILABLE"
            });
        }

        const fileName = `Certificado_${certificado.dataValues.student_id}_${certificado.dataValues.course_id}.pdf`;
        return res.download(filePath, fileName);

    } catch (error) {
        console.error('[Download Error]', error);
        res.status(500).json({
            error: "Error al descargar certificado",
            code: "DOWNLOAD_ERROR",
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const getCerticateById = async (req: Request, res: Response) => {
    try {
        const student_id = req.params.student_id;

        if (!student_id || isNaN(Number(student_id))) {
            return res.status(400).json({ error: 'ID de estudiante inválido' });
        }

        const certificados = await Certificate.findAll({
            where: { student_id },
            include: [{
                model: Courses,
                as: 'course',
                attributes: ['title', 'id'],
            }],
            order: [['issue_date', 'DESC']]
        });

        if (!certificados.length) {
            return res.status(404).json({ error: 'No se encontraron certificados' });
        }

        res.json(certificados.map(c => ({
            id: c.dataValues.id,
            course: c.dataValues.course.title,
            issue_date: c.dataValues.issue_date,
            status: c.dataValues.status,
            download_url: `/api/certificates/download/${c.dataValues.id}`
        })));

    } catch (error) {
        console.error('Error en getCerticateById:', error);
        res.status(500).json({
            error: 'Error al obtener certificados',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
export const checkAndGenerateCertificates = async (req: Request, res: Response) => {
    try {
        const student_id = req.params.student_id;
        const course_id = req.params.course_id;
        
        console.log('student', student_id, 'course',course_id);
        // Validación básica
        if (!student_id || !course_id) {
            return res.status(400).json({ 
                error: "Se requieren student_id y course_id",
                code: "MISSING_REQUIRED_FIELDS"
            });
        }

        // 1. Verificar si ya existe el certificado
        const existingCert = await isCertificateAlreadyIssued(Number(student_id), Number(course_id));

        // Si existe y tiene archivo 
        if (existingCert?.dataValues?.file_path && await fileExists(existingCert.dataValues.file_path)) {
            return res.json({
                success: true,
                message: "Certificado ya existe",
                action: "download",
                file_path: existingCert.dataValues.file_path,
                download_url: `/api/certificates/download/${existingCert.dataValues.id}`,
                certificate: {
                    id: existingCert.dataValues.id,
                    issue_date: existingCert.dataValues.issue_date,
                    status: existingCert.dataValues.status
                }
            });
        }

        // 2. Verificar requisitos del estudiante 
        const [student, course, enrolled, approved, attendance] = await Promise.all([
            getStudentWithUser(student_id),
            findCourseById(course_id),
            isStudentAlreadyEnrolled(Number(student_id), Number(course_id)),
            isStudentApproved(Number(student_id)),
            calculateAttendancePercentageByCourse(Number(student_id), Number(course_id))
        ]);

        // Validaciones 
        if (!student) {
            return res.status(404).json({ 
                error: 'Estudiante no encontrado',
                code: "STUDENT_NOT_FOUND" 
            });
        }

        if (!course) {
            return res.status(404).json({ 
                error: 'Curso no encontrado',
                code: "COURSE_NOT_FOUND" 
            });
        }

        if (!enrolled) {
            return res.status(400).json({ 
                error: 'Estudiante no inscrito en este curso',
                code: "NOT_ENROLLED" 
            });
        }

        if (!approved) {
            return res.status(400).json({ 
                error: 'Estudiante no aprobado',
                code: "NOT_APPROVED" 
            });
        }

        // Reutilizando tu lógica de isAttendanceSufficient
        const percentage = parseFloat(attendance.percentage.replace('%', ''));
        if (percentage < 80) {
            return res.status(400).json({ 
                error: `Asistencia insuficiente (${attendance.percentage})`,
                code: "INSUFFICIENT_ATTENDANCE",
                details: attendance
            });
        }

        // 3. Si pasa todas las validaciones (pero NO genero el certificado aún)
        res.json({
            success: true,
            message: "Estudiante cumple con todos los requisitos para generar certificado",
            action: "generate",
            student: {
                id: student.dataValues.id,
                name: student.dataValues.user?.name,
                lastname: student.dataValues.user?.lastname,
                dni: student.dataValues.user?.dni
            },
            course: {
                id: course.dataValues.id,
                title: course.dataValues.title
            },
            requirements: {
                enrolled: true,
                approved: true,
                attendance: attendance
            }
        });

    } catch (error) {
        console.error('[Check Certificate Error]', error);
        res.status(500).json({
            success: false,
            error: "Error al verificar certificado",
            code: "SERVER_ERROR",
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};





