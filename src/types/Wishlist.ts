// This file contains the TypeScript interfaces for the Wishlist feature of the application.
// It defines the structure of the data that is passed between components.
// The WishlistItem interface represents an item in the wishlist, including properties such as id, user_id, product_id, and added_at.
// The AddToWishlistInput interface is used for adding an item to the wishlist, including the product_id.
// The interfaces are designed to be used in a TypeScript application, allowing for type checking and better code organization.

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    added_at: string;
  }
  
  export interface AddToWishlistInput {
    product_id: string;
  }
  