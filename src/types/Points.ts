export interface ManualAddPointsInput {
    user_id: string;
    points: number;
    reason?: string; // optional, if you support tracking why
  }
  
  export interface PointsResponse {
    message: string;
    new_total?: number;
  }
  