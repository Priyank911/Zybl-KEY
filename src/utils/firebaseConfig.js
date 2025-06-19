// Firebase configuration for Zybl Passport
// src/utils/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiK3T07NvTjFJ5S2gLCRXYLZdfAOM-oz4",
  authDomain: "zybl-key.firebaseapp.com",
  projectId: "zybl-key",
  storageBucket: "zybl-key.firebasestorage.app",
  messagingSenderId: "457906869938",
  appId: "1:457906869938:web:b8932aa47c1b83d0529bab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
export default app;
