// This file defines the UserPrivacy interface, which represents the privacy settings of a user in the application.
// The interface includes properties for allowing friend requests, messages, profile visibility, wishlist visibility, recent purchases visibility, and appearing offline.
// Each property is of a specific type, such as boolean or string, and the profile_visibility property has a union type to restrict its values to specific options.
// This structure allows for easy management and validation of user privacy settings in the application.

export interface UserPrivacy {
    allow_friend_requests: boolean;
    allow_messages: boolean;
    profile_visibility: "public" | "private" | "friends-only";
    show_wishlist: boolean;
    show_recent_purchases: boolean;
    appear_offline: boolean;
  }
  