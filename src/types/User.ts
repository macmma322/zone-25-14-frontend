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