// src/components/notifications/NotificationBell.tsx
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext"; // Import the hook
import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, fetchNotifications } =
    useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications initially
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="Notifications">
        <div
          className="relative cursor-pointer transition-all hover:scale-105"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white font-semibold px-1.5 py-0.5 rounded-full shadow-md">
              {unreadCount}
            </span>
          )}
        </div>
      </Tooltip>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 text-white rounded-lg shadow-lg z-50 p-2 border border-zinc-700">
          <div className="text-sm font-semibold mb-1 px-1">Notifications</div>
          {notifications.length === 0 ? (
            <div className="text-sm px-2 py-4 text-center text-zinc-400">
              No new notifications
            </div>
          ) : (
            <ul className="divide-y divide-zinc-700 max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.notification_id}
                  className="p-2 hover:bg-zinc-800 rounded"
                  onClick={() => handleMarkAsRead(n.notification_id)}
                >
                  {n.link ? (
                    <Link href={n.link}>
                      <span className="text-sm cursor-pointer">
                        {n.content}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-sm">{n.content}</span>
                  )}
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
