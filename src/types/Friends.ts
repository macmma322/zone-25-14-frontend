// File: src/types/Friends.ts
// This file defines the types related to friends and friend lists in the application.
// It includes types for friend requests, friend lists, and friend status.

export interface Friend {
  user_id: string;
  username: string;
  avatar?: string;
  conversation_id: string;
  pinned: boolean;
  unread_count: number;
  last_message_time: string | null;
  is_online?: boolean;
}

export type FriendListGrouped = {
  pinned: Friend[];
  recent: Friend[];
};
