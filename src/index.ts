import express from 'express';
import dotenv from 'dotenv';
import initializeDB from '../config/dbConfig';
import authRoutes from './routes/auth.routes'; 
import cors from 'cors';
import courseRoutes from './routes/course.routes';
import teacherRoutes from './routes/teacher.routes';
import userRoutes from './routes/user.routes';
import AssistRoutes from './routes/assist.routes';
import ClassRoutes from './routes/class.routes';
import studentRoutes from './routes/student.routes';
import inscritionRoutes from './routes/inscription.routes';
import PaymentRoutes from './routes/payment.routes';
import newsRoutes from './routes/news.routes';
import {updateCourseStatus} from './controllers/course.controller';
import certificateRoutes from "./routes/certificate.routes";
import cron from 'node-cron';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assists', AssistRoutes);
app.use('/api/classes', ClassRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/inscriptions', inscritionRoutes);
app.use('/api/certificates', certificateRoutes );
app.use('/api/payments', PaymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);

// **Tarea programada con node-cron**
cron.schedule("*/1 * * * *", async () => {
    // console.log("Ejecutando actualización de estado de cursos...");
    await updateCourseStatus();
  });
app.get('/', (req, res) => {
    res.send('API corriendo');
});

//Run server
(async ()=>{
    await initializeDB();
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    });
})();