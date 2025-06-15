// components/ui/Tooltip.tsx
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react-dom";
import React, { useState, useRef, useEffect } from "react";

type Props = {
  content: string;
  children: React.ReactNode;
  className?: string;
};

export default function Tooltip({ content, children, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { x, y, strategy, refs, update } = useFloating({
    placement: "top",
    middleware: [offset(8), flip(), shift()],
  });

  useEffect(() => {
    if (refs.reference.current && refs.floating.current) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      const isInside =
        wrapperRef.current?.matches(":hover") ||
        refs.floating.current?.matches(":hover");

      if (!isInside) setOpen(false);
    }, 300);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block tooltip-hover-zone ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={refs.setReference}>{children}</span>

      {open && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 9999,
          }}
          className="bg-zinc-900 text-white text-xs rounded px-3 py-2 shadow-lg max-w-xs text-center break-words whitespace-pre-wrap"
        >
          {content}
        </div>
      )}
    </div>
  );
}
