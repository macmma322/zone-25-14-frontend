// This file contains the TypeScript interfaces for the Points system in the application.
// It includes the Points interface, which represents a user's points with properties such as user_id, total_points, and last_updated_at.
// It also includes the ManualAddPointsInput interface, which is used for adding points to a user's account manually, and the PointsResponse interface, which represents the response from the server after adding points.
// The interfaces are defined using the TypeScript interface syntax, with properties and types specified as needed.
// The interfaces are designed to match the expected data structure of the Points system, allowing for easy integration
// and manipulation of points-related data within the application.

export interface ManualAddPointsInput {
    user_id: string;
    points: number;
    reason?: string; // optional, if you support tracking why
  }
  
  export interface PointsResponse {
    message: string;
    new_total?: number;
  }
  