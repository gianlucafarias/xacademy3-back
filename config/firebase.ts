import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';


const serviceAccount: ServiceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();