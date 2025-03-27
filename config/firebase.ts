import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el objeto serviceAccount usando las variables de entorno
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

// Inicializar Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();