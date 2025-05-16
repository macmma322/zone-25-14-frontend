"use client";

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { NicheProvider } from "@/context/NicheContext";
import TopNav from "@/components/layout/TopNav";
import SidebarPanel from "@/components/layout/SidebarPanel";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* 🔔 Global toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <AuthProvider>
        <NicheProvider>
          <TopNav onOpenSidebar={() => setSidebarOpen(true)} />
          <SidebarPanel
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="pt-24 min-h-screen w-full px-6">{children}</main>
        </NicheProvider>
      </AuthProvider>
    </>
  );
}
