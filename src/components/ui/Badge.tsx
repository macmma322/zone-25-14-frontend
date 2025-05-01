// components/ui/Badge.tsx
import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  color?: "default" | "success" | "danger" | "niche";
}

const Badge: React.FC<BadgeProps> = ({ children, color = "default" }) => {
  const colorStyles = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-200 text-green-800",
    danger: "bg-red-200 text-red-800",
    niche: "bg-[#FF2D00] text-white", // default: OtakuSquad red
  };

  return (
    <span
      className={clsx(
        "inline-block text-xs font-semibold px-2 py-1 rounded-full",
        colorStyles[color]
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
