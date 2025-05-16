// src/utils/apiFunctions.ts

import api from "./api";
import { User } from "@/types/User";
import { UserPreferences } from "@/types/UserPreferences";
import { UserPrivacy } from "@/types/UserPrivacy";

// NEW return type includes user data
interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface UploadResponse {
  message: string;
}

export const loginUser = async (
  username: string,
  password: string,
  setUser: (user: User | null) => void
): Promise<LoginResponse> => {
  const res = await api.post<{ token: string }>("/auth/login", {
    username,
    password,
  });

  const token = res.data.token;

  if (token) {
    localStorage.setItem("authToken", token);
    const user = await fetchUserProfile();
    setUser(user); // ✅ updates AuthContext
    return { token, user };
  }

  throw new Error("Login failed — no token returned.");
};

export const registerUser = async (
  formData: RegisterFormData
): Promise<User> => {
  const res = await api.post<User>("/auth/register", formData);
  return res.data;
};

export const logoutUser = (
  setUser: (user: User | null) => void,
  navigate: () => void
) => {
  localStorage.removeItem("authToken");
  setUser(null);
  navigate(); // ← let the component decide how to route or refresh
};

export const fetchUserProfile = async (): Promise<User> => {
  const res = await api.get<User>("/users/profile");
  return res.data;
};

export const updateUsername = async (newUsername: string): Promise<User> => {
  const res = await api.patch<User>("/users/profile", {
    username: newUsername,
  });
  return res.data;
};

export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.patch<UploadResponse>(
    "/users/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

interface GenericMessage {
  message: string;
}

export const setBirthday = async (date: string): Promise<GenericMessage> => {
  const res = await api.patch<GenericMessage>("/users/profile/birthday", {
    birthday: date,
  });
  return res.data;
};

export const fetchUserPreferences = async (): Promise<UserPreferences> => {
  const res = await api.get<UserPreferences>("/users/preferences");
  return res.data;
};

export const updateUserPreferences = async (
  preferences: UserPreferences
): Promise<UserPreferences> => {
  const res = await api.patch<UserPreferences>(
    "/users/preferences",
    preferences
  );
  return res.data;
};

export const fetchUserPrivacySettings = async (): Promise<UserPrivacy> => {
  const res = await api.get<UserPrivacy>("/users/privacy");
  return res.data;
};

export const updateUserPrivacySettings = async (
  settings: Partial<UserPrivacy>
): Promise<UserPrivacy> => {
  const res = await api.patch<UserPrivacy>("/users/privacy", settings);
  return res.data;
};

import { CartItem, AddToCartInput, UpdateCartItemInput } from "@/types/Cart";

export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await api.get<CartItem[]>("/cart");
  return res.data;
};

export const addToCart = async (item: AddToCartInput): Promise<CartItem> => {
  const res = await api.post<CartItem>("/cart", item);
  return res.data;
};

export const updateCartItem = async (
  itemId: string,
  update: UpdateCartItemInput
): Promise<CartItem> => {
  const res = await api.patch<CartItem>(`/cart/${itemId}`, update);
  return res.data;
};

export const removeCartItem = async (
  itemId: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/cart/${itemId}`);
  return res.data;
};

import { ManualAddPointsInput, PointsResponse } from "@/types/Points";

export const manuallyAddPoints = async (
  data: ManualAddPointsInput
): Promise<PointsResponse> => {
  const res = await api.post<PointsResponse>("/points/manual-add", data);
  return res.data;
};

import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/Product";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>("/products");
  return res.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  const res = await api.post<Product>("/products", data);
  return res.data;
};

export const updateProduct = async (
  id: string,
  updates: UpdateProductInput
): Promise<Product> => {
  const res = await api.patch<Product>(`/products/${id}`, updates);
  return res.data;
};

export const softDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.patch<{ message: string }>(
    `/products/${id}/soft-delete`
  );
  return res.data;
};

export const hardDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(
    `/products/${id}/hard-delete`
  );
  return res.data;
};

import { SubscribeInput, UserSubscription } from "@/types/Subscription";

export const subscribeToNiches = async (
  data: SubscribeInput
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/subscriptions", data);
  return res.data;
};

export const fetchUserSubscriptions = async (): Promise<UserSubscription[]> => {
  const res = await api.get<UserSubscription[]>("/subscriptions");
  return res.data;
};

export const cancelSubscription = async (
  subscriptionId: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(
    `/subscriptions/${subscriptionId}`
  );
  return res.data;
};

import { WishlistItem, AddToWishlistInput } from "@/types/Wishlist";

export const fetchWishlist = async (): Promise<WishlistItem[]> => {
  const res = await api.get<WishlistItem[]>("/wishlist");
  return res.data;
};

export const addToWishlist = async (
  data: AddToWishlistInput
): Promise<WishlistItem> => {
  const res = await api.post<WishlistItem>("/wishlist", data);
  return res.data;
};

export const removeFromWishlist = async (
  itemId: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/wishlist/${itemId}`);
  return res.data;
};
