import type {
  INodeType,
  INodeTypeDescription,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from "n8n-workflow";
import { NodeConnectionType } from "n8n-workflow";
import { buildNodeProperties } from "./utils/nodeBuilder";
import {
  loadPlatformAccounts,
  SUPPORTED_PLATFORMS,
} from "./utils/platformHelpers";
import {
  profilesResource,
  postsResource,
  mediaResource,
  accountsResource,
  connectResource,
  usageResource,
  facebookResource,
  linkedinResource,
  cloneResource,
  webhooksResource,
  queueResource,
  accountGroupsResource,
  analyticsResource,
  blueskyResource,
  pinterestResource,
  redditResource,
  telegramResource,
  googlebusinessResource,
  snapchatResource,
  invitesResource,
  logsResource,
  apiKeysResource,
  usersResource,
} from "./resources";

export class Late implements INodeType {
  methods = {
    loadOptions: Object.fromEntries(
      SUPPORTED_PLATFORMS.map((platform) => [
        `get${platform.value.charAt(0).toUpperCase() + platform.value.slice(1)}Accounts`,
        async function (
          this: ILoadOptionsFunctions
        ): Promise<INodePropertyOptions[]> {
          return loadPlatformAccounts(this, platform.value);
        },
      ])
    ),
  };

  description: INodeTypeDescription = {
    displayName: "LATE",
    name: "late",
    icon: "file:late-logo.svg",
    group: ["transform"],
    version: 1,
    description:
      "Schedule and manage social media posts across multiple platforms with LATE - supporting Twitter/X, Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Bluesky, Pinterest, Reddit, Telegram, Google Business, and Snapchat",
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    defaults: {
      name: "LATE",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],

    credentials: [
      {
        name: "lateApi",
        required: true,
      },
    ],

    requestDefaults: {
      baseURL: "https://zernio.com/api/v1",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },

    properties: buildNodeProperties({
      profiles: profilesResource,
      posts: postsResource,
      media: mediaResource,
      accounts: accountsResource,
      connect: connectResource,
      usage: usageResource,
      facebook: facebookResource,
      linkedin: linkedinResource,
      clone: cloneResource,
      // Core resources
      webhooks: webhooksResource,
      queue: queueResource,
      accountGroups: accountGroupsResource,
      analytics: analyticsResource,
      // Platform management resources
      bluesky: blueskyResource,
      pinterest: pinterestResource,
      reddit: redditResource,
      telegram: telegramResource,
      googlebusiness: googlebusinessResource,
      snapchat: snapchatResource,
      // Additional resources
      invites: invitesResource,
      logs: logsResource,
      apiKeys: apiKeysResource,
      users: usersResource,
    }),
  };
}
