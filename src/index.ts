import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';
import initializeDB from '../config/dbConfig';
import authRoutes from './routes/auth.routes'; 
import cors from 'cors';
import courseRoutes from './routes/course.routes';
import teacherRoutes from './routes/teacher.routes';
import authMiddleware from './utils/authMiddleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/courses', authMiddleware as RequestHandler, courseRoutes);
app.use('/api/teachers', authMiddleware as RequestHandler, teacherRoutes); // Si también deseas proteger esta ruta


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