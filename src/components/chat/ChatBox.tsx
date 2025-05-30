"use client";

import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "@/utils/api/messagingApi";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const socket: Socket = io("http://localhost:5000", {
  withCredentials: true,
});

type Message = {
  message_id: string;
  username: string;
  content: string;
  sent_at?: string;
  read_at?: string;
};

export default function ChatBox({
  conversationId,
}: {
  conversationId: string;
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.emit("joinRoom", conversationId);

    const fetchMessages = async () => {
      try {
        const res = await getMessages(conversationId);
        setMessages(res.messages.reverse());
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("showTyping", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("showTyping");
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendMessage(conversationId, text);
      setText("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    socket.emit("typing", conversationId);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isMine = msg.username === user?.username;
          return (
            <div
              key={msg.message_id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] ${
                  isMine ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
              >
                <p className="text-sm font-semibold text-white/60">
                  {msg.username}
                </p>
                <p className="break-words">{msg.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(msg.sent_at!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {index === messages.length - 1 && msg.read_at && isMine && (
                  <p className="text-xs text-blue-400 text-right mt-1">
                    ✓ Read
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {isTyping && (
        <p className="text-xs text-white/40 px-4">User is typing...</p>
      )}

      <div className="flex border-t border-white/10 p-2 bg-zinc-950">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white px-3 py-2 outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
