// File: src/utils/userSettingsApi.ts
import api from "../api";
import { UserPreferences } from "@/types/UserPreferences";
import { UserPrivacy } from "@/types/UserPrivacy";

interface GenericMessage {
  message: string;
}

export const setBirthday = async (date: string): Promise<GenericMessage> => {
  const res = await api.patch<GenericMessage>("/users/profile/birthday", {
    birthday: date,
  });
  return res.data;
};

export const fetchUserPreferences = async (): Promise<UserPreferences> => {
  const res = await api.get<UserPreferences>("/users/preferences");
  return res.data;
};

export const updateUserPreferences = async (
  preferences: UserPreferences
): Promise<UserPreferences> => {
  const res = await api.patch<UserPreferences>(
    "/users/preferences",
    preferences
  );
  return res.data;
};

export const fetchUserPrivacySettings = async (): Promise<UserPrivacy> => {
  const res = await api.get<UserPrivacy>("/users/privacy");
  return res.data;
};

export const updateUserPrivacySettings = async (
  settings: Partial<UserPrivacy>
): Promise<UserPrivacy> => {
  const res = await api.patch<UserPrivacy>("/users/privacy", settings);
  return res.data;
};
