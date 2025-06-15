// app/chat/[conversationId]/page.tsx
"use client";

import { useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import FriendsSidebar from "@/components/chat/FriendsSidebar";
import { Toaster } from "react-hot-toast";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  return (
    <div className="flex h-screen bg-black text-white pt-19">
      {/* Left: Friends/Conversations */}
      <div className="w-[320px] border-r border-white/10 bg-zinc-900 overflow-y-auto">
        <FriendsSidebar onSelect={setSelectedConversationId} />
      </div>

      {/* Right: Chat Box */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            <ChatBox conversationId={selectedConversationId} />
            <Toaster position="bottom-center" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/40 text-xl">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
