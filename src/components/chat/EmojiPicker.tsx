// EmojiPicker.tsx
"use client";

import React, { useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

type Props = {
  onSelect: (emoji: string) => void;
  open: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
};

export default function EmojiPicker({ open, onClose, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;

    const picker = new Picker({
      data,
      onEmojiSelect: (emoji: { native: string }) => {
        onSelect(emoji.native);
        onClose();
      },
      theme: "dark",
    });

    containerRef.current.innerHTML = ""; // clear old picker
    containerRef.current.appendChild(picker as unknown as Node);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onSelect, onClose]);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bottom-full right-0 mb-2"
    />
  );
}
