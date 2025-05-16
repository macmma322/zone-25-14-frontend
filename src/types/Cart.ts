// This file contains TypeScript interfaces for the Cart module of the application.
// It defines the structure of the data that is passed between components.
// The CartItem interface represents an item in the cart, including properties such as id, product_variation_id, quantity, added_at, and user_id.
// The AddToCartInput interface is used for adding an item to the cart, including the product_variation_id and quantity.
// The UpdateCartItemInput interface is used for updating the quantity of an item in the cart.
// The RemoveCartItemInput interface is used for removing an item from the cart.
// The interfaces are designed to be used in a TypeScript application, allowing for type checking and better code organization.
// The interfaces are also designed to be flexible and extensible, allowing for future changes and additions to the cart functionality.
// The interfaces are also designed to be used in a GraphQL schema, allowing for easy integration with any GraphQL server or client library.
// The interfaces are also designed to be used in a RESTful API, allowing for easy integration with
// any RESTful server or client library.

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
  