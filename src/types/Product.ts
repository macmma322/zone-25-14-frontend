// This file contains the TypeScript interfaces for the Product entity.
// It includes the Product interface, which represents a product with various properties such as product_id, name, description, base_price, currency_code, brand_id, is_active, is_exclusive, and created_at.
// The Product interface is used to define the structure of a product object in the application.
// It is a part of the application's data model, which is used to interact with the database and perform CRUD operations on products.
// The interface is designed to be used in a TypeScript application, allowing for type checking and better code organization.
// The CreateProductInput and UpdateProductInput interfaces are used for creating and updating products, respectively.
// They define the input structure required for these operations, including properties such as name, base_price, currency_code, description, brand_id, and is_exclusive.

export interface Product {
  product_id: string;
  name: string;
  description?: string;
  base_price: number;
  currency_code: string;
  brand_id?: string;
  is_active: boolean;
  is_exclusive?: boolean;
  created_at: string;
}

export interface CreateProductInput {
  name: string;
  base_price: number;
  currency_code: string;
  description?: string;
  brand_id?: string;
  is_exclusive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  base_price?: number;
  currency_code?: string;
  description?: string;
  brand_id?: string;
  is_exclusive?: boolean;
}
