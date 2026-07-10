import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Safe fallbacks to allow running without breaking if env variables are not fully configured
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "algora-systems.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "algora-systems",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "algora-systems.appspot.com",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
