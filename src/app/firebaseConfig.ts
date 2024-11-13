// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiAu4YMvJ4-SLyxqidkzcMhsoUly4R8QI",
  authDomain: "rsm-risco-saude-mental.firebaseapp.com",
  projectId: "rsm-risco-saude-mental",
  storageBucket: "rsm-risco-saude-mental.firebasestorage.app",
  messagingSenderId: "714254723864",
  appId: "1:714254723864:web:a666e7eb5c0bf5fc268c6d",
  measurementId: "G-E70MTF70CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
const db = getFirestore(app);

export { db };
export default app;