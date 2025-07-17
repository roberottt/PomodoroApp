import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signInWithGoogle, logout as firebaseLogout } from "@/lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
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
    login,
    logout,
  };
};
