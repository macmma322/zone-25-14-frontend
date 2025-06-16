"use client";

import { useEffect, useState } from "react";
import { getFriendsList, togglePinnedFriend } from "@/utils/api/friendsApi";
import { UserCircle2, Pin, Search } from "lucide-react";
import Image from "next/image";
import { getSocket } from "@/utils/socket";
import { toast } from "react-hot-toast";
import { startConversation } from "@/utils/api/messagingApi";
import { motion, AnimatePresence } from "framer-motion";

type Friend = {
  friend_id: string;
  username: string;
  profile_picture: string | null;
  pinned: boolean;
  unread_count: number;
  last_message_time: string | null;
  is_online?: boolean;
};

type Props = {
  activeConversationId: string;
  onSelect: (id: string) => void;
};

export default function FriendsSidebar({
  activeConversationId,
  onSelect,
}: Props) {
  const [pinned, setPinned] = useState<Friend[]>([]);
  const [recent, setRecent] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");

  const fetchFriends = async () => {
    try {
      const res = await getFriendsList();
      const pinnedFriends = res.filter((f: Friend) => f.pinned);
      const recentFriends = res
        .filter((f: Friend) => !f.pinned)
        .sort((a: Friend, b: Friend) => {
          const timeA = new Date(a.last_message_time ?? 0).getTime();
          const timeB = new Date(b.last_message_time ?? 0).getTime();
          return timeB - timeA;
        });

      setPinned(pinnedFriends);
      setRecent(recentFriends);
    } catch (err) {
      console.error("Failed to load friends:", err);
    }
  };

  const handlePinToggle = async (friend: Friend) => {
    try {
      await togglePinnedFriend(friend.friend_id);
      fetchFriends();
    } catch (err) {
      console.error("Pin update failed:", err);
    }
  };

  const filtered = (list: Friend[]) =>
    list.filter((f) => f.username.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    fetchFriends();

    let socket;
    try {
      socket = getSocket();
    } catch {
      console.warn("❌ Socket not ready — skipping listeners");
      return;
    }

    type PresencePayload = { userId: string; status: "online" | "offline" };
    type FriendRequestPayload = { username: string };

    const handlePresence = ({ userId, status }: PresencePayload) => {
      const isOnline = status === "online";
      setPinned((prev) =>
        prev.map((f) =>
          f.friend_id === userId ? { ...f, is_online: isOnline } : f
        )
      );
      setRecent((prev) =>
        prev.map((f) =>
          f.friend_id === userId ? { ...f, is_online: isOnline } : f
        )
      );
    };

    const handleFriendRequest = ({ username }: FriendRequestPayload) => {
      toast.success(`New friend request from ${username}`, { icon: "📬" });
    };

    socket.on("presence", handlePresence);
    socket.on("friendRequest", handleFriendRequest);

    return () => {
      socket.off("presence", handlePresence);
      socket.off("friendRequest", handleFriendRequest);
    };
  }, []);

  const renderFriend = (f: Friend) => {
    const isActive = activeConversationId === f.friend_id;

    return (
      <motion.div
        key={f.friend_id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        className={`relative w-full flex justify-between items-center px-3 py-2 rounded-md transition group ${
          isActive ? "bg-zinc-700 ring-1 ring-white/10" : "hover:bg-zinc-800"
        }`}
      >
        {/* Side indicator bar when active */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-white/20 rounded-r-md" />
        )}

        <button
          onClick={async () => {
            try {
              const res = await startConversation([f.friend_id]);
              const convoId = res.conversation.conversation_id;
              onSelect(convoId);
            } catch (err) {
              console.error("Failed to start conversation:", err);
            }
          }}
          className="flex gap-3 items-center w-full text-left"
        >
          {/* Avatar */}
          {f.profile_picture ? (
            <div className="relative">
              <Image
                src={f.profile_picture}
                alt={f.username}
                width={36}
                height={36}
                className="rounded-full border border-zinc-700"
              />
              {f.is_online && (
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"
                  title="Online"
                />
              )}
            </div>
          ) : (
            <div className="relative w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white/50">
              <UserCircle2 size={22} />
              {f.is_online && (
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"
                  title="Online"
                />
              )}
            </div>
          )}

          {/* Username + unread */}
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                isActive ? "text-white" : "text-white/90"
              }`}
            >
              {f.username}
            </span>
            {f.unread_count > 0 && (
              <span
                className="text-xs text-blue-400"
                title={`${f.unread_count} unread message${
                  f.unread_count > 1 ? "s" : ""
                }`}
              >
                {f.unread_count} unread
              </span>
            )}
          </div>
        </button>

        {/* Pin button */}
        <button
          onClick={() => handlePinToggle(f)}
          className="text-white/30 hover:text-blue-500 ml-2"
          title={f.pinned ? "Unpin" : "Pin"}
        >
          <Pin
            size={16}
            className={f.pinned ? "fill-blue-500 text-blue-500" : ""}
          />
        </button>
      </motion.div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white text-lg font-semibold">Friends</h2>

      <div className="flex items-center gap-2 bg-zinc-800 rounded-md px-3 py-2">
        <Search className="text-white/40" size={18} />
        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-white text-sm flex-1"
        />
      </div>

      {filtered(pinned).length > 0 && (
        <>
          <h3 className="text-white/50 text-xs">📌 Pinned</h3>
          <AnimatePresence mode="popLayout">
            {filtered(pinned).map(renderFriend)}
          </AnimatePresence>
        </>
      )}

      {filtered(recent).length > 0 && (
        <>
          <h3 className="text-white/50 text-xs mt-4">🕓 Recent</h3>
          <AnimatePresence mode="popLayout">
            {filtered(recent).map(renderFriend)}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
