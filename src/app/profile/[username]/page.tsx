// File: src/app/profile/[username]/page.tsx

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { fetchUserByUsername } from "@/utils/api/userApi";
import type { User, PublicProfile } from "@/types/User";
import { rolesMeta } from "@/types/Role";
import RelationshipActions from "@/components/profile/RelationshipActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageButton from "@/components/profile/MessageButton";

import {
  faUser,
  faShieldHalved,
  faStar,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const runtime = "nodejs";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  // Read authToken cookie from request
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("authToken")?.value;

  let user: User | PublicProfile | null = null;
  let isCurrentUser = false;

  try {
    if (authToken) {
      // Decode token to check if logged-in user matches profile username
      const jwt = await import("jsonwebtoken");
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(authToken, secret) as {
        username: string;
      };

      if (decoded.username === username) {
        // Fetch private profile using token (pass cookie manually)
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Cookie: `authToken=${authToken}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch private profile");
        }
        user = await res.json();
        isCurrentUser = true;
      }
    }

    if (!user) {
      // Fetch public profile if not logged-in user or no token
      user = await fetchUserByUsername(username);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return notFound();
  }

  if (!user || !user.username) {
    return notFound();
  }

  type RelationshipStatus = {
    targetId: string;
    areFriends: boolean;
    hasPendingFriendRequest: boolean;
    theySentRequest: boolean;
    requestId: string | null;
    canMessage: boolean;
  };

  let relationship: RelationshipStatus | null = null;
  console.log("RELATIONSHIP from server:", relationship);
  if (!isCurrentUser && authToken) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/relationship/${username}`,
        {
          headers: {
            Cookie: `authToken=${authToken}`,
          },
          cache: "no-store",
        }
      );

      console.log("Relationship fetch status:", res.status);

      if (res.ok) {
        relationship = await res.json();
      } else {
        const text = await res.text();
        console.warn(
          "Relationship fetch failed with status:",
          res.status,
          text
        );
      }
    } catch (err) {
      console.error("Relationship fetch threw error:", err);
    }
  }

  // Determine role name & metadata
  const roleName =
    "role" in user
      ? user.role ?? "Explorer"
      : "role_name" in user
      ? user.role_name ?? "Explorer"
      : "Explorer";

  const roleMeta = rolesMeta[roleName] || rolesMeta["Explorer"];

  // Get avatar URL
  const avatar =
    "avatar" in user ? user.avatar : user.profile_picture ?? undefined;

  // Border color for avatar depending on role
  const borderColor =
    roleName === "Founder" ? "border-yellow-400" : "border-white/20";
  console.log("Loaded user profile:", user);

  const targetUserId =
    "user_id" in user
      ? String(user.user_id)
      : "id" in user
      ? String(user.id)
      : "";

  return (
    <div
      className={`min-h-screen flex justify-center items-start pt-24 px-4 text-white ${
        isCurrentUser
          ? "bg-gradient-to-br from-green-900 to-black"
          : "bg-gradient-to-b from-black via-zinc-900 to-black"
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl backdrop-blur-sm border border-white/10 p-6 shadow-xl ${
          isCurrentUser ? "bg-green-950/40" : "bg-white/5"
        }`}
      >
        {isCurrentUser && (
          <div className="text-center text-sm text-green-400 font-semibold mb-4">
            You&#39;re viewing your own profile
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-6">
            {avatar ? (
              <Image
                src={avatar as string}
                alt="avatar"
                width={80}
                height={80}
                className={`w-20 h-20 rounded-full object-cover border-4 ${borderColor}`}
                priority
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-3xl border-4 ${borderColor}`}
              >
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.username}
              </h1>
              <p className="text-sm text-white/50 mt-1 uppercase tracking-wider">
                {roleMeta.title}
              </p>

              {"title_name" in user && user.title_name && (
                <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
                  {user.title_name}
                </p>
              )}
              {"badge_name" in user && user.badge_name && (
                <p className="text-blue-400 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    className="text-blue-300"
                  />
                  {user.badge_name}
                </p>
              )}
            </div>
          </div>

          {isCurrentUser && (
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition text-sm text-white">
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
              Edit Profile
            </button>
          )}
          {!isCurrentUser && relationship && (
            <RelationshipActions
              username={username}
              relationship={relationship}
            />
          )}
        </div>

        {user.biography && (
          <div className="mt-4">
            <h2 className="text-sm text-white/60 mb-1 font-semibold">Bio:</h2>
            <p className="text-white/90 whitespace-pre-line leading-relaxed">
              {user.biography}
            </p>
          </div>
        )}

        {isCurrentUser && (
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/60">
            <div>
              <p className="text-white font-bold">
                {"email" in user ? user.email : ""}
              </p>
              <p className="text-xs text-white/40">Email</p>
            </div>
            <div>
              <p className="text-white font-bold">
                $
                {"store_credit" in user ? user.store_credit.toFixed(2) : "0.00"}
              </p>
              <p className="text-xs text-white/40">Store Credit</p>
            </div>
          </div>
        )}

        {"points" in user && (
          <>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-lg font-bold text-white">12</p>
                <p className="text-white/50">Friends</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{user.points}</p>
                <p className="text-white/50">Points</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">5</p>
                <p className="text-white/50">Achievements</p>
              </div>
            </div>

            <div className="w-full h-2 mt-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{
                  width: `${Math.min((user.points / 5000) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-white/40 text-right mt-1">
              Next Rank:{" "}
              {typeof user.next_rank === "object"
                ? `${user.next_rank.points_needed} points`
                : user.next_rank}
            </p>
          </>
        )}

        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-sm font-medium">
            Follow
          </button>

          {!isCurrentUser && targetUserId && (
            <MessageButton targetUserId={targetUserId} />
          )}
        </div>
      </div>
    </div>
  );
}
