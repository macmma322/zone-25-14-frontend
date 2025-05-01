"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// ✅ Niche key format: lowercase, underscore (matches nicheThemes.ts keys)
export type NicheKey =
  | "otakusquad"
  | "stoikrclub"
  | "wd_crew"
  | "peros_pack"
  | "crithit_team"
  | "the_grid_opus"
  | "the_syndicate"
  | "zone"; // Default fallback

interface NicheContextType {
  currentNiche: NicheKey;
  setNiche: (niche: NicheKey) => void;
}

const NicheContext = createContext<NicheContextType | undefined>(undefined);

export const NicheProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentNiche, setCurrentNiche] = useState<NicheKey>("zone");

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("zone_niche");
    if (saved) {
      setCurrentNiche(saved as NicheKey);
    }
  }, []);

  // ✅ Set & persist
  const setNiche = (niche: NicheKey) => {
    setCurrentNiche(niche);
    localStorage.setItem("zone_niche", niche);
  };

  return (
    <NicheContext.Provider value={{ currentNiche, setNiche }}>
      {children}
    </NicheContext.Provider>
  );
};

export const useNiche = (): NicheContextType => {
  const context = useContext(NicheContext);
  if (!context) {
    throw new Error("useNiche must be used within a NicheProvider");
  }
  return context;
};
