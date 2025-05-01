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
