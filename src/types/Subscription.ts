// This file contains TypeScript interfaces for subscription-related data structures.
// It defines the structure of a subscription plan, user subscription, and input data for subscribing to a plan.
// The SubscriptionPlan interface represents a subscription plan with properties such as plan_id, name, description, price, currency_code, duration_months, and is_active.
// The UserSubscription interface represents a user's subscription with properties such as subscription_id, plan_id, user_id, start_date, duration_months, end_date, and is_active.
// The SubscribeInput interface is used for subscribing to a plan, including the plan_ids and duration_months.
// The interfaces are designed to be used in a TypeScript application, allowing for type checking and better code organization.

export interface UserSubscription {
    subscription_id: string;
    plan_id: string;
    user_id: string;
    start_date: string;
    duration_months: number;
    end_date: string;
    is_active: boolean;
  }
  
  export interface SubscribeInput {
    plan_ids: string[];       // multiple niche plan IDs
    duration_months: number;  // 1, 3, 6, 12
  }
  