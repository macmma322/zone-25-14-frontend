// File: src/utils/api/wishlistApi.ts
import api from "../api";
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
  const res = await api.delete<{ message: string }>(`/api/wishlist/${itemId}`);
  return res.data;
};
