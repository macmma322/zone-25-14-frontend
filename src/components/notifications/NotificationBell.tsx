"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Tooltip from "@/components/ui/Tooltip";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/utils/api/notificationsApi";
import { initSocket, getSocket } from "@/utils/socket";
import { Notification } from "@/types/Notifications";

const NotificationBell = () => {
  const { user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Init socket once
  useEffect(() => {
    if (user?.user_id) {
      initSocket(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time notification listener
  useEffect(() => {
    try {
      const socket = getSocket();
      socket.on("notification", (notif: Notification) => {
        // new Audio("/sfx/notify.mp3").play().catch(() => {}); // optional sound
        setNotifications((prev) => [notif, ...prev]);
      });

      return () => {
        socket.off("notification");
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.warn("🔌 Socket not ready");
    }
  }, []);

  // Load notifications
  useEffect(() => {
    if (!user) return;
    getNotifications(5)
      .then(setNotifications)
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="Notifications">
        <div
          className="relative cursor-pointer transition-all hover:scale-105"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-[-6px] right-[-6px] bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-md">
              {unreadCount}
            </span>
          )}
        </div>
      </Tooltip>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 text-white rounded-lg shadow-xl z-50 p-2 border border-zinc-700">
          <div className="text-sm font-semibold mb-1 px-1">Notifications</div>
          {notifications.length === 0 ? (
            <div className="text-sm px-2 py-4 text-center text-zinc-400">
              No new notifications
            </div>
          ) : (
            <ul className="divide-y divide-zinc-700 max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.notification_id}
                  className="p-2 hover:bg-zinc-800 rounded group flex justify-between items-start gap-2"
                >
                  <div
                    onClick={async () => {
                      if (!n.is_read) await handleRead(n.notification_id);
                      if (n.link) router.push(n.link);
                      setShowDropdown(false);
                    }}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {n.content}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.is_read && (
                      <button
                        onClick={() => handleRead(n.notification_id)}
                        title="Mark as read"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        ✔️
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.notification_id)}
                      title="Delete"
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="w-full mt-2 text-xs text-center text-blue-400 hover:text-blue-300"
            onClick={() => router.push("/notifications")}
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
