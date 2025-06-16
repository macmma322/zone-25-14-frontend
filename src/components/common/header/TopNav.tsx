"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNiche } from "@/context/NicheContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  faMagnifyingGlass,
  faAngleDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";

const nicheOptions = [
  { key: "zone", label: "Zone 25-14" },
  { key: "otakusquad", label: "OtakuSquad" },
  { key: "stoikrclub", label: "StoikrClub" },
  { key: "wd_crew", label: "WD Crew" },
  { key: "peros_pack", label: "PerOs Pack" },
  { key: "crithit_team", label: "CritHit Team" },
  { key: "the_grid_opus", label: "The Grid Opus" },
  { key: "the_syndicate", label: "The Syndicate" },
];

export default function TopNav({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { user } = useAuth();
  const { currentNiche, setNiche } = useNiche();

  const [showSearch, setShowSearch] = useState(false);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);

  const handleNicheChange = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNiche(key as any);
    setShowNicheDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-black/30 text-white transition-all">
      <div className="flex items-center justify-between px-6 py-3 w-full">
        {/* LEFT */}
        <div className="flex items-center gap-6 w-1/3 min-w-[250px]">
          {/* Logo */}
          <div className="text-lg font-display tracking-wide scale-140">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/branding/logo.webp"
                alt="Zone 25-14 Logo"
                width={40}
                height={40}
              />
            </Link>
          </div>
          {/* Niche Selector */}
          <div className="relative">
            <button
              onClick={() => setShowNicheDropdown(!showNicheDropdown)}
              className="flex items-center gap-1 text-sm hover:text-blue-400 transition"
            >
              <span className="capitalize">
                {currentNiche.replace(/_/g, " ")}
              </span>
              <FontAwesomeIcon icon={faAngleDown} className="w-3 h-3" />
            </button>
            {showNicheDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-black border border-white/10 rounded shadow-lg z-50">
                {nicheOptions.map((niche) => (
                  <button
                    key={niche.key}
                    onClick={() => handleNicheChange(niche.key)}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${
                      currentNiche === niche.key ? "text-red-500" : ""
                    }`}
                  >
                    {niche.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="relative">
            <ThemeToggle />
          </div>
        </div>

        {/* CENTER */}
        <nav className="flex-1 flex justify-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-red-500 transition">
            Home
          </Link>
          <Link href="/store" className="hover:text-red-500 transition">
            Store
          </Link>
          <Link href="/dashboard" className="hover:text-red-500 transition">
            Dashboard
          </Link>
          <Link href="/events" className="hover:text-red-500 transition">
            Events
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4 w-1/3 justify-end">
          {/* Search Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="w-5 h-5 hover:text-blue-300"
              />
            </button>

            <AnimatePresence>
              {showSearch && (
                <motion.input
                  initial={{ scaleX: 0.3, scaleY: 0.1, opacity: 0 }}
                  animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                  exit={{ scaleX: 0.3, scaleY: 0.1, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    duration: 0.4,
                    ease: [0.17, 0.67, 0.83, 0.67],
                  }}
                  style={{
                    transformOrigin: "calc(100% + 17px)",
                  }}
                  className="absolute bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 right-7 top-1/2 -translate-y-1/2 top-0 px-3 py-1 rounded text-sm w-48 shadow-md"
                  placeholder="Search..."
                />
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* Avatar → Sidebar */}
          <button
            onClick={onOpenSidebar}
            className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition"
          >
            {user?.profile_picture ? (
              <Image
                src={user.profile_picture}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="w-5 h-5 text-white/70"
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
