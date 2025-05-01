"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import GlitchButton from "@/components/ui/GlitchButton";
import Button from "@/components/ui/Button";
import { logoutUser } from "@/utils/apiFunctions";
import { useRouter } from "next/navigation"; // ✅ correct

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p className="text-center text-lg p-10">Loading...</p>;

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[var(--Warm-Off-White)] dark:bg-[var(--Void-Black)] text-black dark:text-white flex flex-col items-center justify-center px-6">
      {user ? (
        <>
          <h1 className="text-4xl font-display mb-4 text-center">
            Welcome back,{" "}
            <span className="text-[var(--Scarlet-Red)]">{user.username}</span>{" "}
            👋
          </h1>
          <p className="text-lg max-w-xl text-center">
            You`re in the Zone now. Explore your subscriptions, wishlist, and
            the rebellion.
          </p>
          <Button onClick={() => router.push("/profile")}>Go to Profile</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <h1 className="text-5xl font-display mb-4 text-center">
            Welcome to{" "}
            <span className="text-[var(--Scarlet-Red)]">Zone 25-14</span>
          </h1>
          <p className="text-lg max-w-xl text-center mb-8">
            Loyalty. Passion. Rebellion. Family. A platform for the dreamers who
            never fit in — but always belonged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login">
              <GlitchButton label="Login" />
            </Link>
            <Link href="/auth/register">
              <GlitchButton label="Join the Zone" />
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
