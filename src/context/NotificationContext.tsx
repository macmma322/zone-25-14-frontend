"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Notification } from "@/types/Notifications";
import { getSocket } from "@/utils/socket";
import { useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteNotification,
} from "@/utils/api/notificationsApi";
import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const refetch = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      setNotifications(res);
    } catch (err) {
      console.error("🔔 Failed to fetch notifications", err);
    }
  }, [user]); // ✅ only re-creates if user changes

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    } catch (err) {
      console.error("❌ Failed to delete notification", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    let socket;
    try {
      socket = getSocket();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.warn("🔌 Socket not ready, skipping notification listener.");
      return;
    }

    const handleIncoming = (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("notification", handleIncoming);

    return () => {
      socket?.off("notification", handleIncoming);
    };
  }, [user]); // 🔁 NO refetch here

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return ctx;
};
