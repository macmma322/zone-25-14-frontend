// components/FriendsSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { getFriendsWithConversations } from "@/utils/api/friendsApi";

type Friend = {
  user_id: string;
  username: string;
  conversation_id: string;
};

export default function FriendsSidebar({ onSelect }: { onSelect: (id: string) => void }) {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFriendsWithConversations();
        setFriends(res.friends);
      } catch (err) {
        console.error("Failed to load friends:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-white text-lg font-semibold mb-2">Friends</h2>
      {friends.length === 0 && <p className="text-white/40 text-sm">No active chats yet.</p>}
      {friends.map((f) => (
        <button
          key={f.user_id}
          onClick={() => onSelect(f.conversation_id)}
          className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 transition"
        >
          <span className="text-white">{f.username}</span>
        </button>
      ))}
    </div>
  );
}
