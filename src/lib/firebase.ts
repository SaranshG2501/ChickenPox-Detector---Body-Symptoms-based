
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDB5JCLLYhZex41m7TtgtiN99EwWBaYSyc",
  authDomain: "chickenpoxdetector.firebaseapp.com",
  projectId: "chickenpoxdetector",
  storageBucket: "chickenpoxdetector.firebasestorage.app",
  messagingSenderId: "421190793391",
  appId: "1:421190793391:web:b202a0a57d972bd3cd3c5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
