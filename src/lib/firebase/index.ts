import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { clientConfig } from './config';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const app = initializeApp(clientConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
