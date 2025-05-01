// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/utils/apiFunctions";
import { User } from "../types/User";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { user, loading };
};
