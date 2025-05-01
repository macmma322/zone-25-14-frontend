export interface UserPrivacy {
    allow_friend_requests: boolean;
    allow_messages: boolean;
    profile_visibility: "public" | "private" | "friends-only";
    show_wishlist: boolean;
    show_recent_purchases: boolean;
    appear_offline: boolean;
  }
  