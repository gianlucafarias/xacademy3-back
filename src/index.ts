import express from 'express';
import dotenv from 'dotenv';
import initializeDB from '../config/dbConfig';
import authRoutes from './routes/auth.routes'; 
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

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