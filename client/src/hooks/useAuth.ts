import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signInWithGoogle, logout as firebaseLogout, handleRedirectResult } from "@/lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for redirect result first
        await handleRedirectResult();
      } catch (error) {
        console.error("Redirect error:", error);
        setError("Authentication failed. Please try again.");
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
