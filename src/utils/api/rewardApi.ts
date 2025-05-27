// File: src/utils/api/rewardApi.ts
import api from "../api";
import { ManualAddPointsInput, PointsResponse } from "@/types/Points";
import { SubscribeInput, UserSubscription } from "@/types/Subscription";

export const manuallyAddPoints = async (
  data: ManualAddPointsInput
): Promise<PointsResponse> => {
  const res = await api.post<PointsResponse>("/points/manual-add", data); // ✅
  return res.data;
};

export const subscribeToNiches = async (
  data: SubscribeInput
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/subscriptions", data); // ✅
  return res.data;
};

export const fetchUserSubscriptions = async (): Promise<UserSubscription[]> => {
  const res = await api.get<UserSubscription[]>("/subscriptions"); // ✅
  return res.data;
};

export const cancelSubscription = async (
  subscriptionId: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/api/subscriptions/${subscriptionId}`); // ✅
  return res.data;
};
