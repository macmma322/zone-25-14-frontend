// src/hooks/useAuth.ts
// This file defines a custom hook to access authentication context
// and is used throughout the application to access user authentication state.

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
