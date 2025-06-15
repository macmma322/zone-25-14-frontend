// File: components/chat/ChatBox.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import socket from "@/utils/socket";
import { Message, Reaction } from "@/types/Message";
import {
  getMessages,
  sendMessage,
  toggleReaction,
} from "@/utils/api/messagingApi";
import MessageBubble from "./MessageBubble";
import ReplyPreview from "./ReplyPreview";
import EmojiPicker from "./EmojiPicker";
import { SmilePlus } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  conversationId: string;
};

export default function ChatBox({ conversationId }: Props) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(`message-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-500");
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 1500);
    }
  };

  const setReactionsForMessage = (
    messageId: string,
    updater: React.SetStateAction<Reaction[]>
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.message_id === messageId
          ? {
              ...msg,
              reactions:
                typeof updater === "function"
                  ? (updater as (prev: Reaction[]) => Reaction[])(
                      msg.reactions || []
                    )
                  : updater,
            }
          : msg
      )
    );
  };

  const handleReact = async (messageId: string, emoji: string) => {
    if (!user || !socket.connected) {
      toast.error("⚠️ Cannot react — not connected.");
      return;
    }

    const message = messages.find((m) => m.message_id === messageId);
    if (!message) return;

    const existing = message.reactions?.find((r) => r.user_id === user.user_id);

    let payload = emoji;
    if (existing) {
      payload = existing.reaction === emoji ? `-${emoji}` : emoji;
    }

    try {
      await toggleReaction(messageId, payload);
    } catch (err) {
      console.error("React failed", err);
      toast.error("Reaction failed.");
    }
  };

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return false;
    const threshold = 150;
    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    return distance < threshold;
  };

  const deduplicateMessages = (msgs: Message[]) => {
    const map = new Map<string, Message>();
    for (const m of msgs) map.set(m.message_id, m);
    return Array.from(map.values());
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMessages(conversationId, undefined, 30);
        setMessages(deduplicateMessages(res.messages.reverse()));
        setHasMore(res.hasMore);
        requestAnimationFrame(() =>
          scrollRef.current?.scrollIntoView({ behavior: "auto" })
        );
      } catch (err) {
        console.error("Initial fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [conversationId]);

  useEffect(() => {
    socket.emit("joinRoom", conversationId);

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.message_id === msg.message_id)) return prev;
        return deduplicateMessages([...prev, msg]);
      });
      if (isNearBottom()) {
        requestAnimationFrame(() => {
          const last = messageRefs.current[msg.message_id];
          last?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    const handleReactionUpdate = (data: {
      message_id: string;
      user_id: string;
      reaction: string;
      username: string;
      type: "add" | "remove";
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.message_id !== data.message_id) return msg;

          const prevReactions = msg.reactions || [];
          let updated: Reaction[] = [...prevReactions];

          if (data.type === "remove") {
            updated = updated.filter(
              (r) =>
                !(r.user_id === data.user_id && r.reaction === data.reaction)
            );
          } else {
            // Remove previous reaction by user if exists
            updated = updated.filter((r) => r.user_id !== data.user_id);
            updated.push({
              reaction_id: `live-${Date.now()}`,
              message_id: data.message_id,
              user_id: data.user_id,
              username: data.username,
              reaction: data.reaction,
              reacted_at: new Date().toISOString(),
            });
          }

          return { ...msg, reactions: updated };
        })
      );
    };

    const handleReconnect = async () => {
      try {
        const res = await getMessages(conversationId, undefined, 30);
        setMessages(deduplicateMessages(res.messages.reverse()));
      } catch (err) {
        console.error("❌ Failed to reload messages after reconnect", err);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("reactionUpdated", handleReactionUpdate);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("reactionUpdated", handleReactionUpdate);
      socket.off("connect", handleReconnect);
    };
  }, [conversationId]);

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 150 || loading || !hasMore) return;

    const firstId = messages[0]?.message_id;
    const prevHeight = container.scrollHeight;

    setLoading(true);
    try {
      const res = await getMessages(conversationId, firstId, 30);
      setMessages((prev) =>
        deduplicateMessages([...res.messages.reverse(), ...prev])
      );
      setHasMore(res.hasMore);
      requestAnimationFrame(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight;
      });
    } catch (err) {
      console.error("Pagination failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const sent = await sendMessage(conversationId, text, replyTo?.message_id);
      socket.emit("sendMessage", sent);
      setText("");
      setReplyTo(null);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  if (!user) {
    return <div className="text-white p-4">🔒 Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4"
      >
        {messages.map((msg, i, arr) => {
          const prev = arr[i - 1];
          const isMine = msg.sender_id === user.user_id;
          const showAvatar = !prev || prev.sender_id !== msg.sender_id;
          const showName = showAvatar;

          return (
            <div key={msg.message_id} className={showAvatar ? "" : "ml-[44px]"}>
              <MessageBubble
                ref={(el) => {
                  messageRefs.current[msg.message_id] = el;
                }}
                message={msg}
                isMine={isMine}
                userId={user.user_id}
                showAvatar={showAvatar}
                showName={showName}
                onReply={setReplyTo}
                scrollToMessage={scrollToMessage}
                setReactionsForMessage={setReactionsForMessage}
                onReact={handleReact}
              />
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="px-4 pt-2">
        <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
      </div>

      <div className="relative flex items-center border-t border-white/10 p-4 bg-zinc-950">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-white px-3 py-2 outline-none placeholder-white/40"
        />
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="mr-2 text-white hover:text-blue-500"
          title="Open emoji picker"
        >
          <SmilePlus />
        </button>
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition-all duration-300"
        >
          Send
        </button>

        <EmojiPicker
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={(emoji) => setText((prev) => prev + emoji)}
        />
      </div>
    </div>
  );
}
