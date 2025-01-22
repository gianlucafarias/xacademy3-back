import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('API corriendo');
});

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});