// File: src/utils/api/productApi.ts
import api from "../api";
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
  const res = await api.get<Product>(`/api/products/${id}`);
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
  const res = await api.patch<Product>(`/api/products/${id}`, updates);
  return res.data;
};

export const softDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.patch<{ message: string }>(
    `/api/products/${id}/soft-delete`
  );
  return res.data;
};

export const hardDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(
    `/api/products/${id}/hard-delete`
  );
  return res.data;
};
