"use client";

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { NicheProvider } from "@/context/NicheContext";
import { NotificationProvider } from "@/context/NotificationContext";
import TopNav from "@/components/common/header/TopNav";
import SidebarPanel from "@/components/common/header/SidebarPanel";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* 🔔 Global toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <AuthProvider>
        <NotificationProvider>
          <NicheProvider>
            <TopNav onOpenSidebar={() => setSidebarOpen(true)} />
            <SidebarPanel
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="min-h-screen w-full">{children}</main>
          </NicheProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}
