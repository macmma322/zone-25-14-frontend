// This file contains the TypeScript types for the User object and the UserResponse object.
// These types are used to define the structure of the data returned by the API.
// The User object represents a user in the system, and the UserResponse object represents the response from the API when fetching user data.
// The User object includes properties such as user_id, username, email, phone, first_name, last_name, biography, profile_picture, points, next_rank, role_level_id, role, store_credit, and created_at.
// The UserResponse object includes properties such as user, error, and success.
// File: src/types/User.ts
// File: src/types/User.ts

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;

  first_name?: string;
  last_name?: string;
  biography?: string;
  profile_picture?: string;

  role_level_id: string;
  role?: string; // readable name, e.g. "Founder"
  points: number;
  store_credit: number;

  birthday?: string; // from DB
  birthday_reward_year?: number; // track if user already got birthday bonus

  next_rank:
    | {
        name: string;
        required_points: number;
        points_needed: number;
      }
    | "MAXED OUT"
    | "Staff — Max Tier";

  created_at: string; // ISO format
}

export interface UserResponse {
  user: User;
}

export type PublicProfile = {
  username: string;
  biography: string;
  profile_picture: string | null;
  role_name: string;
  title_name?: string;
  badge_name?: string;
};
