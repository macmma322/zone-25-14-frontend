// File: src/utils/api/cartApi.ts
import api from "../api";
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
  const res = await api.patch<CartItem>(`/api/cart/${itemId}`, update);
  return res.data;
};

export const removeCartItem = async (
  itemId: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/api/cart/${itemId}`);
  return res.data;
};
