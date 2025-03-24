
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function to get the current user's ID token
// This can be used to authenticate requests to your Python backend
export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};

// Example function to make authenticated requests to your Python backend
export const fetchFromPythonBackend = async (endpoint: string, method: string = "GET", data: any = null) => {
  const token = await getCurrentUserToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const backendUrl = "YOUR_PYTHON_BACKEND_URL"; // Change this to your Python backend URL
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };
  
  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${backendUrl}/${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`Backend request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching from Python backend:", error);
    throw error;
  }
};
