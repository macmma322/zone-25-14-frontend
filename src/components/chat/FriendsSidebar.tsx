"use client";

import { useEffect, useState } from "react";
import { getFriendsList, togglePinnedFriend } from "@/utils/api/friendsApi";
import { UserCircle2, Pin } from "lucide-react";
import Image from "next/image";
import socket from "@/utils/socket";
import { toast } from "react-hot-toast";
import { startConversation } from "@/utils/api/messagingApi";

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

  useEffect(() => {
    fetchFriends();

    socket.on("presence", ({ userId, status }) => {
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
    });

    socket.on("friendRequest", ({ username }) => {
      toast.success(`New friend request from ${username}`, {
        icon: "📬",
      });
    });

    return () => {
      socket.off("presence");
      socket.off("friendRequest");
    };
  }, []);

  const renderFriend = (f: Friend) => (
    <div
      key={f.friend_id}
      className={`w-full flex justify-between items-center px-3 py-2 rounded transition group ${
        activeConversationId === f.friend_id
          ? "bg-zinc-800"
          : "hover:bg-zinc-800"
      }`}
    >
      <button
        onClick={async () => {
          try {
            const res = await startConversation([f.friend_id]);
            const convoId = res.conversation.conversation_id;
            onSelect(convoId); // ✅ now it's a real conversation_id
          } catch (err) {
            console.error("Failed to start conversation:", err);
          }
        }}
        className="flex gap-3 items-center w-full text-left"
      >
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

        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">{f.username}</span>
          {f.unread_count > 0 && (
            <span
              className="text-xs text-blue-400"
              title={`${f.unread_count} unread ${
                f.unread_count === 1 ? "message" : "messages"
              }`}
            >
              {f.unread_count} unread
            </span>
          )}
        </div>
      </button>

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
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white text-lg font-semibold">Friends</h2>

      {pinned.length > 0 && (
        <>
          <h3 className="text-white/50 text-xs">📌 Pinned</h3>
          {pinned.map(renderFriend)}
        </>
      )}

      {recent.length > 0 && (
        <>
          <h3 className="text-white/50 text-xs mt-4">🕓 Recent</h3>
          {recent.map(renderFriend)}
        </>
      )}
    </div>
  );
}
