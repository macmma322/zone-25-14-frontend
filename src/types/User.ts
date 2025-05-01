// src/types/User.ts

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
  role?: string; // ← use if joined in SQL
  store_credit: number;
  created_at: string; // ISO from PostgreSQL
}
