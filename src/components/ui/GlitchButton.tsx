// components/ui/GlitchButton.tsx
import React from "react";
import styles from "./GlitchButton.module.css";

interface GlitchButtonProps {
  label?: string;
  onClick?: () => void;
}

const GlitchButton: React.FC<GlitchButtonProps> = ({ label = "GLITCH", onClick }) => {
  return (
    <button
      className={styles.glitchButton}
      data-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{label}</span>
    </button>
  );
};

export default GlitchButton;
