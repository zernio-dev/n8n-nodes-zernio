import type { INodeProperties } from "n8n-workflow";

export interface LateResourceConfig {
  name: string;
  value: string;
  description: string;
}

export interface LateOperationConfig {
  name: string;
  value: string;
  action: string;
  routing?: any;
}

export interface LateFieldConfig extends INodeProperties {}

export interface LateResourceModule {
  operations: LateOperationConfig[];
  fields: LateFieldConfig[];
}

export type LateResource =
  | "profiles"
  | "posts"
  | "media"
  | "accounts"
  | "connect"
  | "usage"
  | "facebook"
  | "linkedin"
  | "clone"
  | "webhooks"
  | "queue"
  | "accountGroups"
  | "analytics"
  | "bluesky"
  | "pinterest"
  | "reddit"
  | "telegram"
  | "googlebusiness"
  | "snapchat"
  | "invites"
  | "logs"
  | "apiKeys"
  | "users";

export const LATE_RESOURCES: LateResourceConfig[] = [
  {
    name: "Profiles",
    value: "profiles",
    description:
      "Organize your social media accounts into profiles for managing multiple brands, clients, or personal accounts separately",
  },
  {
    name: "Posts",
    value: "posts",
    description:
      "Create, schedule, and manage social media posts across multiple platforms with advanced features like threads, stories, and platform-specific settings",
  },
  {
    name: "Media",
    value: "media",
    description:
      "Upload images and videos up to 5GB for use in your social media posts with automatic optimization",
  },
  {
    name: "Social Accounts",
    value: "accounts",
    description:
      "Manage connected social media accounts, view their status, and disconnect accounts when needed",
  },
  {
    name: "Connect Platform",
    value: "connect",
    description:
      "Initiate OAuth flows to connect new social media platforms (Twitter/X, Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads)",
  },
  {
    name: "Usage Statistics",
    value: "usage",
    description:
      "Monitor your current usage against plan limits including uploads, profiles, and billing information",
  },
  {
    name: "Facebook Management",
    value: "facebook",
    description:
      "Manage Facebook pages, select which page to post to, and handle Facebook-specific settings",
  },
  {
    name: "LinkedIn Management",
    value: "linkedin",
    description:
      "Switch between personal and company posting, manage LinkedIn organization settings",
  },
  {
    name: "Clone Connection",
    value: "clone",
    description:
      "Reuse OAuth connections across multiple profiles while targeting different pages or organizations",
  },
  {
    name: "Webhooks",
    value: "webhooks",
    description:
      "Configure webhook notifications for post events, account changes, and messages",
  },
  {
    name: "Queue",
    value: "queue",
    description:
      "Manage queue slots for automated posting schedules across your accounts",
  },
  {
    name: "Account Groups",
    value: "accountGroups",
    description:
      "Create and manage groups of accounts for bulk operations and organized posting",
  },
  {
    name: "Analytics",
    value: "analytics",
    description:
      "View post performance analytics and engagement metrics across platforms",
  },
  {
    name: "Bluesky Management",
    value: "bluesky",
    description:
      "Connect and manage Bluesky accounts using app passwords",
  },
  {
    name: "Pinterest Management",
    value: "pinterest",
    description:
      "Manage Pinterest boards and select which board to post to",
  },
  {
    name: "Reddit Management",
    value: "reddit",
    description:
      "Manage saved subreddits and search for Reddit communities",
  },
  {
    name: "Telegram Management",
    value: "telegram",
    description:
      "Connect and manage Telegram channels for posting",
  },
  {
    name: "Google Business Management",
    value: "googlebusiness",
    description:
      "Manage Google Business locations and respond to reviews",
  },
  {
    name: "Snapchat Management",
    value: "snapchat",
    description:
      "Connect and manage Snapchat profiles for posting",
  },
  {
    name: "Invites",
    value: "invites",
    description:
      "Create invite tokens to grant team members access to profiles",
  },
  {
    name: "Logs",
    value: "logs",
    description:
      "View publishing logs with detailed information about each publishing attempt",
  },
  {
    name: "API Keys",
    value: "apiKeys",
    description:
      "Manage API keys for programmatic access to the Late API",
  },
  {
    name: "Users",
    value: "users",
    description:
      "View users and team members with access to your account",
  },
];

