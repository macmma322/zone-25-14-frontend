// src/utils/api/notificationsApi.ts

import api from "../api";

export const getNotifications = async (limit = 5) => {
  const res = await api.get(`/notifications?limit=${limit}`);
  return res.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await api.patch(`/notifications/${notificationId}`);
};

export const markAllNotificationsAsRead = async () => {
  await api.patch("/notifications/mark-all");
};

export const deleteNotification = async (notificationId: string) => {
  await api.delete(`/notifications/${notificationId}`);
};
