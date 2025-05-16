"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/User";
import { fetchUserProfile } from "@/utils/apiFunctions";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      fetchUserProfile()
        .then((userData) => {
          setUser(userData);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          localStorage.removeItem("authToken");
        });
    }
  }, []);

  const handleSetUser = (user: User | null) => {
    setUser(user);
    if (!user) {
      localStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, setUser: handleSetUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
