// File: src/utils/api/userApi.ts
import api from "../api";
import { User, PublicProfile } from "@/types/User";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

// Log in user by sending credentials, expects cookie token set by backend
// Then fetch user profile and update state
export const loginUser = async (
  username: string,
  password: string,
  setUser: (user: User | null) => void
): Promise<User> => {
  await api.post(
    "/auth/login",
    { username, password },
    { withCredentials: true }
  );

  const user = await fetchUserProfile();
  setUser(user);
  return user;
};

// Register user API call
export const registerUser = async (
  formData: RegisterFormData
): Promise<User> => {
  const res = await api.post<User>("/auth/register", formData);
  return res.data;
};

// Fetch private user profile (requires auth cookie)
export const fetchUserProfile = async (): Promise<User> => {
  const res = await api.get<User>("/users/profile");
  return res.data;
};

// Fetch public user profile by username
export const fetchUserByUsername = async (
  username: string
): Promise<PublicProfile> => {
  const res = await api.get<PublicProfile>(`/users/${username}`);
  return res.data;
};

// Update username for logged-in user
export const updateUsername = async (newUsername: string): Promise<User> => {
  const res = await api.patch<User>("/users/profile", {
    username: newUsername,
  });
  return res.data;
};

// Logout user, clears server cookie
export const logoutApi = async (): Promise<void> => {
  await api.post("/auth/logout");
};
