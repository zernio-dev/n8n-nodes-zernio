import type { ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";

export interface PlatformAccount {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
}

export interface PlatformConfig {
  name: string;
  value: string;
  displayName: string;
  usernamePrefix?: string;
}

export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  {
    name: "Twitter/X",
    value: "twitter",
    displayName: "Twitter/X Accounts",
    usernamePrefix: "@",
  },
  {
    name: "Instagram",
    value: "instagram",
    displayName: "Instagram Accounts",
    usernamePrefix: "@",
  },
  { name: "Facebook", value: "facebook", displayName: "Facebook Accounts" },
  { name: "LinkedIn", value: "linkedin", displayName: "LinkedIn Accounts" },
  {
    name: "TikTok",
    value: "tiktok",
    displayName: "TikTok Accounts",
    usernamePrefix: "@",
  },
  { name: "YouTube", value: "youtube", displayName: "YouTube Accounts" },
  {
    name: "Threads",
    value: "threads",
    displayName: "Threads Accounts",
    usernamePrefix: "@",
  },
  {
    name: "Bluesky",
    value: "bluesky",
    displayName: "Bluesky Accounts",
    usernamePrefix: "@",
  },
  { name: "Pinterest", value: "pinterest", displayName: "Pinterest Accounts" },
  {
    name: "Reddit",
    value: "reddit",
    displayName: "Reddit Accounts",
    usernamePrefix: "u/",
  },
  { name: "Telegram", value: "telegram", displayName: "Telegram Channels" },
  {
    name: "Google Business",
    value: "googlebusiness",
    displayName: "Google Business Accounts",
  },
  { name: "Snapchat", value: "snapchat", displayName: "Snapchat Accounts" },
];

/**
 * Generic function to load accounts for any platform
 */
export async function loadPlatformAccounts(
  context: ILoadOptionsFunctions,
  platform: string
): Promise<INodePropertyOptions[]> {
  try {
    const response = await context.helpers.requestWithAuthentication.call(
      context,
      "lateApi",
      {
        method: "GET",
        url: "https://zernio.com/api/v1/accounts",
        json: true,
      }
    );

    if (!response?.accounts) {
      return [{ name: `No ${platform} accounts found - connect at zernio.com first`, value: "none" }];
    }

    const platformAccounts = response.accounts.filter(
      (account: PlatformAccount) => account.platform === platform
    );

    if (platformAccounts.length === 0) {
      return [{ name: `No ${platform} accounts connected - connect at zernio.com first`, value: "none" }];
    }

    const platformConfig = SUPPORTED_PLATFORMS.find(
      (p) => p.value === platform
    );
    const usernamePrefix = platformConfig?.usernamePrefix || "";

    return platformAccounts.map((account: PlatformAccount) => ({
      name: `${usernamePrefix}${account.username || account.displayName || account._id}`,
      value: account._id,
    }));
  } catch (error) {
    const errorMsg =
      (error as any)?.cause?.code === "ECONNREFUSED"
        ? "Cannot connect to Zernio API. Please check your internet connection."
        : (error as Error).message || "Failed to load accounts";
    return [{ name: `Connection error: ${errorMsg} - check API key`, value: "error" }];
  }
}

/**
 * Builds the platform mapping expression for create/update operations
 * Fixed: Use proper n8n expression syntax that evaluates correctly
 */
export function buildPlatformMappingExpression(): string {
  return "={{ $parameter.selectedPlatforms.map(platform => { if (platform === 'twitter') return $parameter.twitterAccounts?.map(id => ({ platform: 'twitter', accountId: id })) || []; if (platform === 'instagram') return $parameter.instagramAccounts?.map(id => ({ platform: 'instagram', accountId: id })) || []; if (platform === 'facebook') return $parameter.facebookAccounts?.map(id => ({ platform: 'facebook', accountId: id })) || []; if (platform === 'linkedin') return $parameter.linkedinAccounts?.map(id => ({ platform: 'linkedin', accountId: id })) || []; if (platform === 'tiktok') return $parameter.tiktokAccounts?.map(id => ({ platform: 'tiktok', accountId: id })) || []; if (platform === 'youtube') return $parameter.youtubeAccounts?.map(id => ({ platform: 'youtube', accountId: id })) || []; if (platform === 'threads') return $parameter.threadsAccounts?.map(id => ({ platform: 'threads', accountId: id })) || []; if (platform === 'bluesky') return $parameter.blueskyAccounts?.map(id => ({ platform: 'bluesky', accountId: id })) || []; if (platform === 'pinterest') return $parameter.pinterestAccounts?.map(id => ({ platform: 'pinterest', accountId: id })) || []; if (platform === 'reddit') return $parameter.redditAccounts?.map(id => ({ platform: 'reddit', accountId: id })) || []; if (platform === 'telegram') return $parameter.telegramAccounts?.map(id => ({ platform: 'telegram', accountId: id })) || []; if (platform === 'googlebusiness') return $parameter.googlebusinessAccounts?.map(id => ({ platform: 'googlebusiness', accountId: id })) || []; if (platform === 'snapchat') return $parameter.snapchatAccounts?.map(id => ({ platform: 'snapchat', accountId: id })) || []; return []; }).flat() }}";
}

/**
 * Processes media items to ensure proper variable evaluation
 */
export function processMediaItems(mediaItems: any): any[] {
  if (!mediaItems || !Array.isArray(mediaItems)) {
    return [];
  }

  return mediaItems.map((item) => ({
    type: item.type || "image",
    url: item.url,
    filename: item.filename || "",
    mimeType: item.mimeType || "",
    ...(item._id && { _id: item._id }),
  }));
}

/**
 * Processes tags string into array
 */
export function processTags(tagsString: string | undefined): string[] {
  if (!tagsString || typeof tagsString !== "string") {
    return [];
  }

  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
