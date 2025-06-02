// zone-25-14-frontend/src/components/chat/ChatBox.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { getMessages } from "@/utils/api/messagingApi";
import { useAuth } from "@/context/AuthContext";
import { useNiche } from "@/context/NicheContext";
import { nicheThemes } from "@/data/nicheThemes";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000", { withCredentials: true });

type Props = {
  conversationId: string;
};

type Message = {
  message_id: string;
  username: string;
  content: string;
  sent_at?: string;
  read_at?: string;
};

export default function ChatBox({ conversationId }: Props) {
  const { user } = useAuth();
  const { currentNiche } = useNiche();
  const theme = nicheThemes[currentNiche];

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socket.emit("joinRoom", conversationId);

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await getMessages(conversationId, undefined, 30);
        setMessages(res.messages.reverse());
        setHasMore(res.hasMore);
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => scrollToBottom(), 100);
    });

    socket.on("showTyping", (typingUser: string) => {
      if (typingUser !== user?.username) {
        setIsTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("showTyping");
    };
  }, [conversationId, user?.username]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = async () => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollTop > 100 || loading || !hasMore) return;

    setLoading(true);
    const firstMessageId = messages[0]?.message_id;

    try {
      const res = await getMessages(conversationId, firstMessageId, 30);
      if (res.messages.length === 0) setHasMore(false);
      setMessages((prev) => [...res.messages.reverse(), ...prev]);
    } catch (err) {
      console.error("Failed to load older messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ conversationId, content: text }),
      });
      setText("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { conversationId, username: user?.username });
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onScroll={handleScroll}
      >
        {loading && (
          <div className="text-center text-xs text-white/40 py-2 animate-pulse">
            Loading messages...
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.username === user?.username;
          return (
            <div
              key={msg.message_id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words transition-all duration-300 ${
                  isMine ? "text-white" : theme.text
                }`}
                style={{
                  backgroundColor: isMine
                    ? theme.accent
                    : "var(--Charcoal-Gray)",
                }}
              >
                <p className="text-sm font-semibold text-white/60">
                  {msg.username}
                </p>
                <p>{msg.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(msg.sent_at!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-sm text-white/40 px-4">Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex border-t border-white/10 p-2 bg-zinc-950">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-transparent text-white px-3 py-2 outline-none placeholder-white/40"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition-all duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}