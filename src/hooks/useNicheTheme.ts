import { useNiche } from "@/context/NicheContext";
import { nicheThemes } from "@/data/nicheThemes";

export const useNicheTheme = () => {
  const { currentNiche } = useNiche();
  return nicheThemes[currentNiche];
};
