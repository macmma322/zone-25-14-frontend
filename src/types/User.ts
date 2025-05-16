// This file contains the TypeScript types for the User object and the UserResponse object.
// These types are used to define the structure of the data returned by the API.
// The User object represents a user in the system, and the UserResponse object represents the response from the API when fetching user data.
// The User object includes properties such as user_id, username, email, phone, first_name, last_name, biography, profile_picture, points, next_rank, role_level_id, role, store_credit, and created_at.
// The UserResponse object includes properties such as user, error, and success.

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;

  first_name?: string;
  last_name?: string;
  biography?: string;
  profile_picture?: string;

  points: number;
  next_rank:
    | {
        name: string;
        required_points: number;
        points_needed: number;
      }
    | "MAXED OUT"
    | "Staff — Max Tier";

  role_level_id: string;
  role?: string;
  store_credit: number;
  created_at: string; // ISO format
}
export interface UserResponse {
  user: User;
  token: string;
}