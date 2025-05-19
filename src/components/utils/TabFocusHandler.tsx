// src/components/utils/TabFocusHandler.tsx
"use client";

import { useEffect } from "react";

export default function TabFocusHandler() {
  useEffect(() => {
    const originalTitle = document.title;

    const handleBlur = () => {
      document.title = "🥺 Please come back to the Zone";
    };

    const handleFocus = () => {
      document.title = originalTitle;
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return null;
}
