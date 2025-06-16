// zone-25-14-frontend/src/components/chat/ScrollToBottomButton.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  visible: boolean;
  newMessageCount: number;
  onClick: () => void;
};

export default function ScrollToBottomButton({
  visible,
  newMessageCount,
  onClick,
}: Props) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-[92px] right-6 z-20 bg-[#0f0f0f] text-white p-3 rounded-full shadow-lg ring-2 ring-blue-600 transition-opacity hover:bg-zinc-800"
      title="Scroll to latest"
    >
      <ChevronDown size={20} />
      {newMessageCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          {newMessageCount > 9 ? "9+" : newMessageCount}
        </div>
      )}
    </button>
  );
}
