"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;

  if (!user || !["Store Chief", "Hype Lead", "Founder"].includes(user.role)) {
    router.push("/auth/login");
    return null;
  }

  return <div>Welcome to the dashboard, {user.username}</div>;
}
