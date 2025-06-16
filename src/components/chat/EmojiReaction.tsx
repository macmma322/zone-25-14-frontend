"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Reaction } from "@/types/Message";
import { toggleReaction } from "@/utils/api/messagingApi";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/utils/socket";

const EMOJIS = ["🔥", "❤️", "😄", "💀", "👏", "😭", "👍", "👎", "🥹", "😡"];

type Props = {
  messageId: string;
  reactions: Reaction[];
  setReactions: React.Dispatch<React.SetStateAction<Reaction[]>>;
  trigger: React.ReactNode;
};

export default function EmojiReaction({
  messageId,
  reactions,
  trigger,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const handleToggle = async (emoji: string) => {
    if (!user) {
      toast.error("⚠️ Login required to react.");
      return;
    }

    let socket;
    try {
      socket = getSocket();
    } catch (err) {
      console.warn("❌ Socket not ready:", err);
      toast.error("⚠️ Socket not connected.");
      return;
    }

    if (!socket.connected) {
      toast.error("⚠️ Socket disconnected.");
      return;
    }

    const existingReaction = reactions.find((r) => r.user_id === user.user_id);
    const isSameEmoji = existingReaction?.reaction === emoji;
    const payload = isSameEmoji ? `-${emoji}` : emoji;

    try {
      await toggleReaction(messageId, payload);
      toast.success(
        isSameEmoji ? `❌ Removed ${emoji}` : `❤️ Reacted with ${emoji}`,
        { duration: 1000 }
      );
      setOpen(false);
    } catch (err) {
      console.error("Emoji toggle failed:", err);
      toast.error("Failed to toggle reaction.");
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!wrapperRef.current?.matches(":hover")) {
        setOpen(false);
      }
    }, 400);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="z-10 relative" onClick={() => setOpen((p) => !p)}>
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-[-70px] bg-zinc-800 text-white rounded-xl shadow-lg p-3 grid grid-cols-5 gap-2 text-lg z-[9999] w-[200px] h-[100px]"
          >
            {EMOJIS.map((emoji) => {
              const isMine = reactions.some(
                (r) => r.reaction === emoji && r.user_id === user?.user_id
              );

              return (
                <button
                  key={`${emoji}-${user?.user_id}`}
                  onClick={() => handleToggle(emoji)}
                  className={`transition-transform duration-150 hover:scale-125 hover:brightness-125 ${
                    isMine ? "ring-2 ring-blue-500 bg-blue-600 rounded-md" : ""
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
