import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { UserCircle2, SmilePlus, Trash2, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message, Reaction } from "@/types/Message";
import Tooltip from "../ui/Tooltip";
import EmojiReaction from "./EmojiReaction";
import { useAuth } from "@/context/AuthContext";

type Props = {
  message: Message;
  isMine: boolean;
  userId: string;
  showAvatar: boolean;
  showName: boolean;
  onReply: (msg: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
  scrollToMessage?: (messageId: string) => void;
  onEdit?: (msg: Message) => void;
  onDelete?: (msg: Message) => void;
  setReactionsForMessage: (
    messageId: string,
    updater: React.SetStateAction<Reaction[]>
  ) => void;
};

const MessageBubble = forwardRef<HTMLDivElement, Props>(function MessageBubble(
  {
    message,
    isMine,
    showAvatar,
    showName,
    onReply,
    onReact,
    scrollToMessage,
    onEdit,
    onDelete,
    setReactionsForMessage,
  },
  ref
) {
  const { user } = useAuth();
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      id={`message-${message.message_id}`}
      className="flex items-start gap-2 group relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {showAvatar && !isMine && (
        <div className="w-9 h-9 text-white shrink-0">
          <UserCircle2 size={36} />
        </div>
      )}

      <div className="relative max-w-[75%] flex flex-col text-sm text-white px-4 py-2 hover:bg-white/5 rounded-md transition">
        {/* 👤 Sender Name */}
        {showName && (
          <div className="text-white font-semibold mb-1">
            {message.username}
            {isMine && <span className="ml-1 text-white/40">(You)</span>}
            <span className="ml-2 text-xs text-white/40">
              {new Date(message.sent_at ?? Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* ↩️ Reply Preview */}
        {message.reply_to_message && (
          <div
            onClick={() =>
              message.reply_to_message?.message_id &&
              scrollToMessage?.(message.reply_to_message.message_id)
            }
            className="mb-2 px-3 py-2 bg-white/5 border-l-4 border-blue-600 text-xs text-white/70 rounded-sm cursor-pointer hover:bg-white/10"
          >
            ↪️ Replying to{" "}
            <span className="text-blue-400 font-medium">
              @{message.reply_to_message.username}
            </span>
            :{" "}
            <span className="italic">
              “{message.reply_to_message.content.slice(0, 100)}”
            </span>
          </div>
        )}

        {/* 🧠 Message Content with Markdown */}
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-white/80">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-zinc-800 text-white px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-400 hover:text-blue-300 transition"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-1">{children}</p>,
              li: ({ children }) => (
                <li className="list-disc ml-5">{children}</li>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* ❤️ Emoji Reactions with Avatars and Tooltip */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap items-center">
            {[...new Set(message.reactions.map((r) => r.reaction))].map(
              (emoji) => {
                const emojiReactions = message.reactions!.filter(
                  (r) => r.reaction === emoji
                );
                const usernames = emojiReactions.map((r) => r.username);
                const userReacted = emojiReactions.some(
                  (r) => r.username === user?.username
                );

                return (
                  <Tooltip
                    key={emoji}
                    content={`Used by: ${usernames.join(", ")}`}
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-sm transition-transform duration-150 hover:scale-110 ${
                        userReacted
                          ? "bg-blue-700 text-white ring-2 ring-blue-400"
                          : "bg-zinc-700 text-white/80"
                      }`}
                      onClick={() => onReact(message.message_id, emoji)}
                    >
                      <span>
                        {emoji} {emojiReactions.length}
                      </span>
                      <div className="flex -space-x-2 ml-1">
                        {emojiReactions.slice(0, 3).map((r, i) =>
                          r.avatar ? (
                            <img
                              key={i}
                              src={r.avatar}
                              alt={r.username}
                              className="w-5 h-5 rounded-full border-2 border-zinc-900"
                            />
                          ) : (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center border-2 border-zinc-900 text-[10px] text-white"
                            >
                              <UserCircle2 size={12} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Tooltip>
                );
              }
            )}
          </div>
        )}

        {/* 🧩 Hover Buttons */}
        {hovering && (
          <div className="absolute right-[-70] flex flex-row gap-2 text-white/60 bg-zinc-800 px-2 py-1 rounded-md shadow-md z-10">
            <button
              onClick={() => onReply(message)}
              className="hover:text-white"
              title="Reply"
            >
              ↩️
            </button>
            <EmojiReaction
              messageId={message.message_id}
              reactions={message.reactions || []}
              setReactions={(updater) =>
                setReactionsForMessage(message.message_id, updater)
              }
              trigger={<SmilePlus size={18} />}
            />

            {isMine && (
              <>
                <button
                  onClick={() => onEdit?.(message)}
                  className="hover:text-white"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete?.(message)}
                  className="hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showAvatar && isMine && (
        <div className="w-9 h-9 text-white shrink-0">
          <UserCircle2 size={36} />
        </div>
      )}
    </motion.div>
  );
});

export default MessageBubble;
