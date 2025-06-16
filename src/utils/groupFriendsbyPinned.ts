// src/utils/groupFriendsByPinned.ts
import { Friend, FriendListGrouped } from "@/types/Friends";

export function groupFriendsByPinned(friends: Friend[]): FriendListGrouped {
  const pinned: Friend[] = [];
  const recent: Friend[] = [];

  for (const friend of friends) {
    if (friend.pinned) {
      pinned.push(friend);
    } else {
      recent.push(friend);
    }
  }

  return { pinned, recent };
}
