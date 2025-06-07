// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNDNeJoCqQVCNUdhGcI9ZOqFi-9Z6kFhY",
  authDomain: "anvesna-df4ee.firebaseapp.com",
  projectId: "anvesna-df4ee",
  storageBucket: "anvesna-df4ee.firebasestorage.app",
  messagingSenderId: "1022515748129",
  appId: "1:1022515748129:web:33e5796b5d6295bd92f260",
  measurementId: "G-BXN1L8TQ1Y"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: default export app if needed
export default app;
