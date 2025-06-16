// File: src/utils/api/friendsApi.ts
import axios from "axios";

// ✅ Send friend request
export const sendFriendRequest = async (username: string) => {
  const res = await fetch(`http://localhost:5000/api/users/friends/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const msg = await res.text();
    console.error("Send friend error:", msg);
    throw new Error("Send friend request failed");
  }
};

// ✅ Cancel friend request
export const cancelFriendRequest = async (username: string) => {
  await fetch(`http://localhost:5000/api/users/friends/request`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
};

// ✅ Accept request
export const acceptFriendRequest = async (requestId: string) => {
  await fetch(`http://localhost:5000/api/users/friends/accept`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
};

// ✅ Decline request
export const declineFriendRequest = async (requestId: string) => {
  await fetch(`http://localhost:5000/api/users/friends/decline`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
};

// ✅ Remove friend (optional backend endpoint)
export async function removeFriend(friendId: string) {
  return fetch(`/api/friends/remove/${friendId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// ✅ Get friends with open 1-on-1 conversations
export const getFriendsWithConversations = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/users/friends/conversations",
    { withCredentials: true }
  );
  return res.data;
};

// ✅ NEW: Get full friend list (with pinned, unread, last message time)
export const getFriendsList = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/users/friends/list",
    { withCredentials: true }
  );
  return res.data; // [{ friend_id, username, profile_picture, pinned, unread_count, last_message_time }]
};

// ✅ NEW: Toggle pinned status for a friend
export const togglePinnedFriend = async (friendId: string) => {
  const res = await fetch(`http://localhost:5000/api/users/friends/pin`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId }),
  });
  if (!res.ok) throw new Error("Failed to toggle pin");
};

// ✅ NEW: Reset unread count for a friend
export const resetUnreadCount = async (friendId: string) => {
  await fetch(`http://localhost:5000/api/users/friends/reset-unread`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId }),
  });
};
