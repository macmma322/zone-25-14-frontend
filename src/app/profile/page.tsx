"use client";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/utils/apiFunctions";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useEffect } from "react";
import { rolesMeta } from "@/types/Role"; // ✅ Ensure correct path

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return <p className="p-10">Loading profile...</p>;

  const roleStyles: Record<string, string> = {
    Founder: "bg-purple-800 text-white",
    "Store Chief": "bg-yellow-500 text-black",
    "Hype Lead": "bg-pink-600 text-white",
    Moderator: "bg-blue-800 text-white",
  };

  const meta = rolesMeta[user.role ?? ""];

  const formattedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--Void-Black)] text-white p-6 flex flex-col items-center justify-start">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-xl shadow-md space-y-4">
        <h1 className="text-4xl font-display text-[var(--Scarlet-Red)] text-center">
          Your Profile
        </h1>

        <div className="space-y-2">
          <p>
            <strong>👤 Username:</strong> {user.username}
          </p>
          <p>
            <strong>📧 Email:</strong> {user.email}
          </p>
          <p>
            <strong>🗓 Joined:</strong> {formattedDate}
          </p>
          <p>
            <strong>💰 Store Credit:</strong> {user.store_credit ?? 0} points
          </p>

          <div>
            <p>
              <strong>🎭 Role:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-sm ${
                  roleStyles[user.role ?? ""] || "bg-gray-700"
                }`}
              >
                {meta?.title ?? user.role}
              </span>
            </p>
            {meta?.description && (
              <p className="text-sm text-gray-400 italic">{meta.description}</p>
            )}
          </div>

          {typeof user.next_rank === "object" ? (
            <>
              <p>
                <strong>⬆️ Next Rank:</strong> {user.next_rank.name}{" "}
                <em>({user.next_rank.points_needed} points left)</em>
              </p>
              <div className="w-full bg-gray-800 h-4 rounded overflow-hidden mt-2">
                <div
                  className="bg-[var(--Scarlet-Red)] h-full transition-all duration-500"
                  style={{
                    width: `${
                      (user.points /
                        (user.points + user.next_rank.points_needed)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </>
          ) : (
            <p>
              <strong>⬆️ Next Rank:</strong> {user.next_rank}
            </p>
          )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
          <Button className="w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <Button className="w-full" variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </main>
  );
}
