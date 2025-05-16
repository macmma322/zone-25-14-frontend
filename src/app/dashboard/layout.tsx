// File: app/dashboard/layout.tsx

import React from "react";
import Navbar from "@/components/layout/TopNav";

export const metadata = {
  title: "User Dashboard | Zone 25-14",
  description: "Access your subscriptions, wishlist, and community tools.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1b1b1b] text-white">
      <Navbar />

      <main className="pt-24 max-w-5xl w-full mx-auto px-6">{children}</main>
    </div>
  );
}
