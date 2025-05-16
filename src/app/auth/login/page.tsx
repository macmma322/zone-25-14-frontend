"use client";

import { useState } from "react";
import { loginUser } from "@/utils/apiFunctions";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { setUser } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password, setUser);
      router.push("/");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        console.error("Login Error:", err);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-900 p-6 rounded-xl max-w-md w-full space-y-4 shadow-lg"
      >
        <h2 className="text-3xl font-display text-center text-[var(--Neon-Green)]">
          Log In
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full">
          Enter the Zone
        </Button>
      </form>
    </main>
  );
}
