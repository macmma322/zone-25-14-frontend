import React from "react";
import { X } from "lucide-react";
import type { Message } from "@/types/Message";

type Props = {
  replyTo: Message | null;
  onCancel: () => void;
};

export default function ReplyPreview({ replyTo, onCancel }: Props) {
  if (!replyTo) return null;

  return (
    <div className="bg-white/10 text-white text-xs px-4 py-2 mb-2 rounded-md border-l-4 border-blue-500 flex justify-between items-center">
      <div>
        Replying to <strong>{replyTo.username}</strong>: &ldquo;
        {replyTo.content.slice(0, 50)}...&ldquo;
      </div>
      <button
        onClick={onCancel}
        className="ml-4 text-white/50 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
