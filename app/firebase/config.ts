import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVpR-k42ZzFAFN0OvOFeHPGhqlbpz_Uaw",
  authDomain: "img2046-477dd.firebaseapp.com",
  projectId: "img2046-477dd",
  storageBucket: "img2046-477dd.appspot.com",
  messagingSenderId: "221537951989",
  appId: "1:221537951989:web:3050298e874e8d8f96e5bc",
  measurementId: "G-4VXE0KP49N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);