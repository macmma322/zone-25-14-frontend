"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/User";
import { fetchUserProfile, loginUser, logoutApi } from "@/utils/api/userApi";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount, e.g. when app loads/refreshed
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserProfile(); // Uses cookie automatically
        setUser(userData);
      } catch (error: unknown) {
        // Handle 401 explicitly and reset user state to null
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Failed to fetch user profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function - calls loginUser, updates user state
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await loginUser(username, password, setUser);
      // loginUser internally sets user with setUser callback
    } catch (error) {
      setUser(null);
      throw error; // Let caller handle errors
    } finally {
      setLoading(false);
    }
  };

  // Logout function - calls API to clear cookie and resets user
  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi(); // clears cookie on server
      setUser(null);
    } catch (error) {
      // Optionally handle logout error
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
