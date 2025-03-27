
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  getDoc,
  DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDB5JCLLYhZex41m7TtgtiN99EwWBaYSyc",
  authDomain: "chickenpoxdetector.firebaseapp.com",
  projectId: "chickenpoxdetector",
  storageBucket: "chickenpoxdetector.appspot.com",
  messagingSenderId: "421190793391",
  appId: "1:421190793391:web:b202a0a57d972bd3cd3c5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Function to convert image file to base64 string
export async function convertImageToBase64(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(imageFile);
  });
}

// Function to save assessment results to Firestore
export async function saveAssessment(userId: string, data: Record<string, unknown>) {
  try {
    const assessmentData = {
      ...data,
      userId,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "assessments"), assessmentData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving assessment:", error);
    throw error;
  }
}

// Function to get user's assessment history
export async function getUserAssessments(userId: string) {
  try {
    const q = query(
      collection(db, "assessments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const assessments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}

// Function to get a single assessment by ID
export async function getAssessmentById(assessmentId: string) {
  try {
    const docRef = doc(db, "assessments", assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw error;
  }
}
