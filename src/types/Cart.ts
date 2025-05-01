export interface CartItem {
    id: string;
    product_variation_id: string;
    quantity: number;
    added_at: string; // ISO timestamp
    user_id: string;
  }
  
  export interface AddToCartInput {
    product_variation_id: string;
    quantity: number;
  }
  
  export interface UpdateCartItemInput {
    quantity: number;
  }
  