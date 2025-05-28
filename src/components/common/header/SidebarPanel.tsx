"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import {
  faXmark,
  faRightFromBracket,
  faGauge,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface SidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarPanel({ isOpen, onClose }: SidebarPanelProps) {
  const { user, logout, loading } = useAuth(); // ✅ added loading
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (
      isOpen &&
      (pathname.startsWith("/auth/") || pathname === "/dashboard")
    ) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // ✅ wait until mounted AND auth is done loading
  if (!mounted || typeof window === "undefined" || loading) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-50 transform-gpu bg-white/5 backdrop-blur-md shadow-lg border-l border-white/10 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-white font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 text-white text-sm">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 relative">
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-10 h-10 text-white/60"
                  />
                )}
                <div>
                  <p className="font-semibold text-white text-base">
                    {user.username}
                  </p>
                  <p className="text-xs text-white/60">
                    {user.role ?? "Member"}
                  </p>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <Link
                    href={`/profile/${user.username}`}
                    className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                    Profile
                  </Link>
                </div>
              </div>

              <hr className="border-white/10" />
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 hover:text-[#FF2D00]"
                >
                  <FontAwesomeIcon icon={faGauge} className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 hover:text-[#FF2D00]"
                >
                  <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toast("You’ve left the Zone. See you soon.", {
                      icon: "👋",
                    });

                    setTimeout(() => {
                      if (window.location.pathname === "/") {
                        window.location.reload();
                      } else {
                        router.push("/");
                      }
                    }, 1000);
                  }}
                  className="flex items-center gap-3 text-red-400 hover:text-red-300"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="w-4 h-4"
                  />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-10 h-10 text-white/60"
                />
                <div>
                  <p className="font-semibold text-white">Guest</p>
                  <p className="text-xs text-white/60">Not logged in</p>
                </div>
              </div>
              <hr className="border-white/10" />
              <div className="space-y-3">
                <Link href="/auth/login" className="block hover:text-[#FF2D00]">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block hover:text-[#FF2D00]"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
