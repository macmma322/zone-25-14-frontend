// File: src/types/Notification.ts
// This file defines the TypeScript type for notifications
// and is used throughout the application to ensure type safety
// when dealing with notification data from the backend.

export type Notification = {
  notification_id: string;
  user_id: string;
  type:
    | "message"
    | "friend"
    | "reaction"
    | "reply"
    | "order"
    | "event"
    | "stream"
    | "announcement"
    | "giveaway"
    | "donation";
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};
