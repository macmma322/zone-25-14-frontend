import { notFound } from "next/navigation";
import { fetchUserByUsername } from "@/utils/apiFunctions";
import type { User, PublicProfile } from "@/types/User";
import { rolesMeta } from "@/types/Role";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchWithAuth } from "@/utils/server/fetchWithAuth";
import {
  faUser,
  faShieldHalved,
  faStar,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { getServerUser } from "@/utils/server/getServerUser";

export const runtime = "nodejs";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function Page(props: Props) {
  const { username } = await props.params;

  let user: User | PublicProfile | null = null;
  let isCurrentUser = false;

const serverUser = await getServerUser();

if (serverUser && serverUser.decoded.username === username) {
  user = await fetchWithAuth("/users/profile", serverUser.token);
  isCurrentUser = true;
} else {
  user = await fetchUserByUsername(username);
}

  if (!user || !user.username) return notFound();

  const roleName =
    "role" in user
      ? user.role ?? "Explorer"
      : (user as PublicProfile).role_name;
  const roleMeta = rolesMeta[roleName] || rolesMeta["Explorer"];
  const avatar =
    "avatar" in user ? user.avatar : user.profile_picture ?? undefined;
  const borderColor =
    roleName === "Founder" ? "border-yellow-400" : "border-white/20";
  console.log(
    "🧪 serverUser.username",
    serverUser?.decoded.username,
    "| route param:",
    username
  );

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
              <img
                src={avatar as string}
                alt="avatar"
                className={`w-20 h-20 rounded-full object-cover border-4 ${borderColor}`}
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
          <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-sm font-medium">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
