//File: src/utils/api/friendsApi.ts
import axios from "axios";

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

export const cancelFriendRequest = async (username: string) => {
  await fetch(`http://localhost:5000/api/users/friends/request`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
};

export const acceptFriendRequest = async (requestId: string) => {
  await fetch(`http://localhost:5000/api/users/friends/accept`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
};

export const declineFriendRequest = async (requestId: string) => {
  await fetch(`http://localhost:5000/api/users/friends/decline`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
};

export async function removeFriend(friendId: string) {
  return fetch(`/api/friends/remove/${friendId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export const getFriendsWithConversations = async () => {
  const res = await axios.get("http://localhost:5000/api/users/friends/conversations", {
    withCredentials: true,
  });
  return res.data;
};
