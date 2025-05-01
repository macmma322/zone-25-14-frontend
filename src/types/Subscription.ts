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
  