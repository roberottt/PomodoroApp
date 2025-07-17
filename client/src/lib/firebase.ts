import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google sign-in with popup...");
    // Try popup first, fallback to redirect if popup is blocked
    const result = await signInWithPopup(auth, provider);
    console.log("Popup sign-in successful:", result.user);
    return result;
  } catch (error: any) {
    console.log("Popup blocked or failed, trying redirect:", error.message);
    console.log("Error code:", error.code);
    
    // If popup fails, use redirect
    console.log("Starting redirect sign-in...");
    return signInWithRedirect(auth, provider);
  }
};

export const handleRedirectResult = async () => {
  try {
    console.log("Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Redirect sign-in successful:", result.user);
      return result;
    } else {
      console.log("No redirect result found");
    }
  } catch (error: any) {
    console.error("Redirect result error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
