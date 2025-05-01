// components/ui/Card.tsx
import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-neutral-900 shadow-md rounded-xl p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
