"use client";
import { useRouter } from "next/navigation";
import { startConversation } from "@/utils/api/messagingApi";
import { toast } from "react-hot-toast";

type Props = {
  targetUserId: string;
};

export default function MessageButton({ targetUserId }: Props) {
  const router = useRouter();

  const handleMessage = async () => {
    try {
      const res = await startConversation([targetUserId]);

      // Optional: feedback for reused conversation
      if (res.existing) {
        toast("Chat already exists — resuming 💬", { icon: "🔁" });
      }

      router.push(`/chat/${res.conversation.conversation_id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error("Failed to start chat");
    }
  };

  return (
    <button
      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition"
      onClick={handleMessage}
    >
      Message
    </button>
  );
}
