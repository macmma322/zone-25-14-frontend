export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    added_at: string;
  }
  
  export interface AddToWishlistInput {
    product_id: string;
  }
  