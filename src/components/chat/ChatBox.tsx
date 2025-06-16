// zone-25-14-frontend/src/components/chat/ChatBox.tsx
// This is a React component for a chat box that handles displaying messages, sending new messages, and reacting to messages with emojis. It uses socket.io for real-time updates and includes features like reply previews and emoji selection.
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import socket from "@/utils/socket";
import { Message, Reaction } from "@/types/Message";
import { getMessages, sendMessage } from "@/utils/api/messagingApi";
import { toggleReaction } from "@/utils/api/messagingApi";
import ScrollToBottomButton from "./ScrollToBottomButton";
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [, setIsAtBottom] = useState(true);

  const isNearBottom = (): boolean => {
    const container = containerRef.current;
    if (!container) return false;

    const threshold = 150;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom < threshold;
  };

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(`message-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight styles
      el.classList.add(
        "ring-2",
        "ring-blue-500",
        "rounded-lg", // ✅ Make ring slightly rounded
        "transition-all",
        "duration-300"
      );

      // Remove highlight after 1.5s
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-blue-500", "rounded-lg");
      }, 1500);
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
    if (!socket.connected) {
      toast.error("⚠️ Cannot react — socket not connected.");
      return;
    }

    try {
      await toggleReaction(messageId, emoji); // Toggle reaction via API
      // 💡 Don't touch setMessages here. Let the socket event handle UI updates
    } catch (err) {
      console.error("React failed", err);
      toast.error("Reaction failed.");
    }
  };

  function deduplicateMessages(messages: Message[]): Message[] {
    const map = new Map<string, Message>();
    for (const msg of messages) {
      map.set(msg.message_id, msg);
    }
    return Array.from(map.values());
  }

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 150 || loading || !hasMore) return;

    const firstId = messages[0]?.message_id;
    const prevHeight = container.scrollHeight;

    setLoading(true);
    try {
      const res = await getMessages(conversationId, firstId, 30);
      const older = res.messages.reverse();
      setMessages((prev) => deduplicateMessages([...older, ...prev]));
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

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
    setNewMessageCount(0);
    setShowScrollButton(false);
  };

  function isTimeGapLarge(
    prev?: Message,
    curr?: Message,
    thresholdMinutes = 120
  ) {
    if (!prev || !curr) return true;
    const prevTime = new Date(prev.sent_at ?? 0).getTime();
    const currTime = new Date(curr.sent_at ?? 0).getTime();
    return currTime - prevTime > thresholdMinutes * 60 * 1000;
  }

  function shouldShowDateSeparator(prev?: Message, curr?: Message) {
    if (!prev || !curr) return true;

    const prevDate = new Date(prev.sent_at ?? 0);
    const currDate = new Date(curr.sent_at ?? 0);

    return (
      prevDate.getDate() !== currDate.getDate() ||
      prevDate.getMonth() !== currDate.getMonth() ||
      prevDate.getFullYear() !== currDate.getFullYear()
    );
  }

  function getDateLabel(timestamp?: string | number | Date) {
    const date = new Date(timestamp ?? Date.now());
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMessages(conversationId, undefined, 30);
        setMessages(deduplicateMessages(res.messages.reverse()));
        setHasMore(res.hasMore);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollIntoView({ behavior: "auto" });
        });
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
        if (prev.find((m) => m.message_id === msg.message_id)) return prev;
        return deduplicateMessages([...prev, msg]);
      });

      if (isNearBottom()) {
        requestAnimationFrame(() => {
          const last = messageRefs.current[msg.message_id];
          last?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else {
        setNewMessageCount((prev) => prev + 1);
        setShowScrollButton(true);
        setIsAtBottom(false);
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

          // 🛡️ SKIP if socket is echoing back our own reaction
          if (data.user_id === user?.user_id) return msg;

          const reactions = msg.reactions || [];
          let updatedReactions = [...reactions];

          if (data.type === "remove") {
            updatedReactions = updatedReactions.filter(
              (r) =>
                !(r.reaction === data.reaction && r.user_id === data.user_id)
            );
          } else if (data.type === "add") {
            const alreadyExists = updatedReactions.some(
              (r) => r.reaction === data.reaction && r.user_id === data.user_id
            );

            if (!alreadyExists) {
              updatedReactions.push({
                reaction_id: `live-${Date.now()}`,
                message_id: data.message_id,
                user_id: data.user_id,
                username: data.username,
                reaction: data.reaction,
                reacted_at: new Date().toISOString(),
              });
            }
          }

          return { ...msg, reactions: updatedReactions };
        })
      );
    };

    const handleReconnect = async () => {
      console.log("🔌 Socket reconnected — resyncing reactions...");
      try {
        const res = await getMessages(conversationId, undefined, 30);
        setMessages(deduplicateMessages(res.messages.reverse()));
      } catch (err) {
        console.error("❌ Failed to reload messages after reconnect", err);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("reactionUpdated", handleReactionUpdate);
    socket.on("connect", handleReconnect); // ✅ add this line

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("reactionUpdated", handleReactionUpdate);
      socket.off("connect", handleReconnect); // ✅ remove on cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    const handleScrollChange = () => {
      const container = containerRef.current;
      if (!container) return;

      const offset =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const isUserNearBottom = offset < 150;

      setShowScrollButton(offset > 250);
      setIsAtBottom(isUserNearBottom);

      if (isUserNearBottom) {
        setNewMessageCount(0);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScrollChange);
    return () => container?.removeEventListener("scroll", handleScrollChange);
  }, []);

  // Tell the parent page that this conversation just had activity
useEffect(() => {
  if (messages.length === 0) return;

  const last = messages[messages.length - 1];

  const event = new CustomEvent("message-activity", {
    detail: {
      conversationId,
      timestamp: last.sent_at || new Date().toISOString(),
    },
  });

  window.dispatchEvent(event);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [messages.length]);


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
          const showAvatar =
            !prev ||
            prev.sender_id !== msg.sender_id ||
            isTimeGapLarge(prev, msg);
          const showName = showAvatar;

          const showDateSeparator = shouldShowDateSeparator(prev, msg);
          return (
            <React.Fragment key={msg.message_id}>
              {showDateSeparator && (
                <div className="text-white/40 text-xs text-center my-4 select-none">
                <hr /> {getDateLabel(msg.sent_at)} <hr />
                </div>
              )}
              <div className={showAvatar ? "" : "ml-[44px]"}>
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
            </React.Fragment>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="px-4 pt-2">
        <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
      </div>

      <div className="relative flex items-center justify-center border-t border-white/10 p-4 bg-zinc-950">
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
          className="mr-2 items-center justify-center text-white hover:text-blue-500"
          title="Open emoji picker"
        >
          <SmilePlus />
        </button>
        <button
          onClick={handleSend}
          className="ml-2 items-center justify-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition-all duration-300"
        >
          Send
        </button>

        <EmojiPicker
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={(emoji) => setText((prev) => prev + emoji)}
        />
      </div>
      <ScrollToBottomButton
        visible={showScrollButton}
        newMessageCount={newMessageCount}
        onClick={scrollToBottom}
      />
    </div>
  );
}
