
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Define the shape of a user profile
export interface UserProfile {
  name: string;
  userId: string;
  email: string;
  contactNo: string;
  post: string;
}

// Define the shape of the auth context
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<User>;
  signup: (name: string, userId: string, email: string, contactNo: string, post: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to sign up a new user
  async function signup(name: string, userId: string, email: string, contactNo: string, post: string, password: string) {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's profile with their name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create a user document in Firestore
      const userProfile = {
        name,
        userId,
        email,
        contactNo,
        post,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // Function to log in an existing user
  async function login(email: string, password: string) {
    try {
      // In Firebase, we need to use email for authentication
      // So we'll assume that userId is the email for simplicity
      // In a real app, you might need to fetch the email based on userId first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Function to log out the current user
  async function logout() {
    return signOut(auth);
  }

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
