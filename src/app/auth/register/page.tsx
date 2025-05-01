"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/apiFunctions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { isAxiosError } from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(formData);
      router.push("/auth/login");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form
        onSubmit={handleRegister}
        className="bg-neutral-900 p-6 rounded-xl max-w-md w-full space-y-4 shadow-lg"
      >
        <h2 className="text-3xl font-display text-center text-[var(--Scarlet-Red)]">
          Register
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full">
          Join the Zone
        </Button>
      </form>
    </main>
  );
}
