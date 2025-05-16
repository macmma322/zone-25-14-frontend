//file: src/types/UserPreferences.ts
// This file defines the UserPreferences interface, which is used to represent user preferences in the application.
// The interface includes properties for theme mode, language, preferred currency, and email notifications.
// Each property is optional, allowing for flexibility in user preferences.

export interface UserPreferences {
    theme_mode?: 'light' | 'dark' | 'system';
    language?: string;
    preferred_currency?: string;
    email_notifications?: boolean;
  }
  