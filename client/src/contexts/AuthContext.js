import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    // 1. Get initial session (important for refresh)
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!registering) {
        setCurrentAuthUser(data?.user ?? null);
        setLoading(false);
      }
    };

    getSession();

    // 2. Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentAuthUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [registering]);

  const value = {
    currentAuthUser,
    loading,
    setCurrentAuthUser,
    setRegistering,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
