// components/ui/Loader.tsx
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-500" />
    </div>
  );
};

export default Loader;
