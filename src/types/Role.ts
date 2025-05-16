//This file defines the structure of a Role object in TypeScript.
// It includes properties for the role name, title, description, icon, staff status, and permissions.
// The RoleMeta interface is used to represent metadata about a role, including its name, title, description, icon, staff status, and permissions.
// The properties are defined with appropriate types, including optional properties for the icon and permissions.
// The interface is designed to be used in a TypeScript application, allowing for type checking and better code organization.

export interface RoleMeta {
  role_name: string;
  title: string;
  description: string;
  icon?: string;
  is_staff?: boolean;
  permissions?: string[];
}

export const rolesMeta: Record<string, RoleMeta> = {
  Founder: {
    role_name: "Founder",
    title: "👑 Founder",
    description:
      "Highest authority — ultimate power over all systems in Zone 25-14.",
    is_staff: true,
    permissions: ["full_access"],
  },
  "Hype Lead": {
    role_name: "Hype Lead",
    title: "🎉 Hype Lead",
    description: "Master of events and energy — leads community excitement.",
    is_staff: true,
    permissions: ["create_events"],
  },
  "Store Chief": {
    role_name: "Store Chief",
    title: "🛒 Store Chief",
    description:
      "Controls the store — handles inventory, products, and orders.",
    is_staff: true,
    permissions: ["manage_inventory", "manage_orders"],
  },
  Moderator: {
    role_name: "Moderator",
    title: "🛡️ Moderator",
    description: "Keeps the peace — manages content, users, and reports.",
    is_staff: true,
    permissions: ["ban_users", "manage_posts"],
  },
  Explorer: {
    role_name: "Explorer",
    title: "🧭 Explorer",
    description: "Every member begins here — the first step into the Zone.",
    is_staff: false,
    permissions: [],
  },
  Supporter: {
    role_name: "Supporter",
    title: "🔥 Supporter",
    description: "Early contributor — helping shape the future of the Zone.",
    is_staff: false,
    permissions: [],
  },
  "Elite Member": {
    role_name: "Elite Member",
    title: "⚡ Elite Member",
    description: "Consistent supporter — gaining influence and perks.",
    is_staff: false,
    permissions: [],
  },
  Legend: {
    role_name: "Legend",
    title: "🏆 Legend",
    description: "Veteran of the Zone — trusted, respected, and rewarded.",
    is_staff: false,
    permissions: [],
  },
  Ultimate: {
    role_name: "Ultimate",
    title: "💎 Ultimate",
    description: "Top-tier member — unlocked the maximum community power.",
    is_staff: false,
    permissions: [],
  },
};
