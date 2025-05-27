// File: src/app/auth/login/LoginClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginClient() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      router.push(`/profile/${username}`);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900 text-white p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 backdrop-blur-md p-8 rounded-xl max-w-md w-full space-y-5 shadow-xl border border-white/10"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-display font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-white/50">
            Log in to your Zone 25-14 account
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          label="Username"
          placeholder="macmma322"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
          {loading ? "Logging in..." : "Enter the Zone"}
        </Button>
      </form>
    </main>
  );
}
