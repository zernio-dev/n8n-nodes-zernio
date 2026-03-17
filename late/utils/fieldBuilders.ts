import type { INodeProperties } from "n8n-workflow";
import { SUPPORTED_PLATFORMS } from "./platformHelpers";

/**
 * Builds platform selection field
 */
export function buildPlatformSelector(): INodeProperties {
  return {
    displayName: "Platforms",
    name: "selectedPlatforms",
    type: "multiOptions",
    options: SUPPORTED_PLATFORMS.map((platform) => ({
      name: platform.name,
      value: platform.value,
    })),
    default: [],
    displayOptions: {
      show: {
        resource: ["posts"],
        operation: ["create", "update"],
      },
    },
    description:
      "Select the platforms where you want to post your content. After selecting platforms, you'll be able to choose specific accounts for each platform.",
    required: true,
  };
}

/**
 * Builds account selector fields for all platforms
 */
export function buildAccountSelectors(): INodeProperties[] {
  return SUPPORTED_PLATFORMS.map((platform) => ({
    displayName: platform.displayName,
    name: `${platform.value}Accounts`,
    type: "multiOptions" as const,
    typeOptions: {
      loadOptionsMethod: `get${platform.value.charAt(0).toUpperCase() + platform.value.slice(1)}Accounts`,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ["posts"],
        operation: ["create", "update"],
        selectedPlatforms: [platform.value],
      },
    },
    description: `Select the ${platform.name} accounts to post to. Make sure you have connected ${platform.name} accounts in your LATE profile.`,
    required: false,
  }));
}

/**
 * Builds media items field with proper variable handling
 */
export function buildMediaItemsField(): INodeProperties {
  return {
    displayName: "Media Items",
    name: "mediaItems",
    type: "fixedCollection",
    default: { items: [] },
    typeOptions: {
      multipleValues: true,
      sortable: true,
    },
    displayOptions: {
      show: {
        resource: ["posts"],
        operation: ["create", "update"],
      },
    },
    description:
      "Media files to attach to your post. Upload files first using 'Media > Upload', then use the returned URLs here. Supports up to 5GB per file.",
    options: [
      {
        name: "items",
        displayName: "Media Items",
        values: [
          {
            displayName: "Type",
            name: "type",
            type: "options",
            options: [
              {
                name: "Image",
                value: "image",
                description: "JPEG, PNG, WebP, GIF images",
              },
              {
                name: "Video",
                value: "video",
                description: "MP4, MOV, AVI, WebM videos",
              },
              {
                name: "GIF",
                value: "gif",
                description: "Animated GIF files",
              },
              {
                name: "Document",
                value: "document",
                description: "PDF documents (LinkedIn only)",
              },
            ],
            default: "image",
            description: "Type of media file",
            required: true,
          },
          {
            displayName: "URL",
            name: "url",
            type: "string",
            default: "",
            noDataExpression: false,
            description:
              "URL of the uploaded media file from the /v1/media endpoint. You can use expressions like ={{ 'https://' + $json.data.color + '.com' }}",
            placeholder:
              "https://zernio.com/api/v1/media/uploaded-file-url.jpg",
            required: true,
          },
          {
            displayName: "Filename",
            name: "filename",
            type: "string",
            default: "",
            description: "Optional filename for the media file",
            placeholder: "vacation-photo.jpg",
          },
          {
            displayName: "MIME Type",
            name: "mimeType",
            type: "string",
            default: "",
            description:
              "MIME type of the file. Required for documents (e.g., application/pdf)",
            placeholder: "image/jpeg",
            displayOptions: {
              show: {
                type: ["document"],
              },
            },
          },
        ],
      },
    ],
  };
}

/**
 * Builds common post fields
 */
export function buildCommonPostFields(): INodeProperties[] {
  return [
    {
      displayName: "Post ID",
      name: "postId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["get", "update", "delete", "retry", "logs"],
        },
      },
      description:
        "The unique identifier of the post. You can get this from the 'List Posts' operation or from the response when creating a post.",
      required: true,
    },
    {
      displayName: "Content",
      name: "content",
      type: "string",
      typeOptions: {
        rows: 4,
      },
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "The main text content of your post. Will be used across all selected platforms. Note: Different platforms have different character limits (Twitter: 280, LinkedIn: 3000, Instagram: 2200). Emojis and hashtags are supported.",
      placeholder: "Hello, world! 🌍 #socialmedia #automation",
      required: true,
    },
    {
      displayName: "Scheduled For",
      name: "scheduledFor",
      type: "dateTime",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "When to publish the post. Leave empty to publish immediately. Date/time should be in the future. Use together with timezone for accurate scheduling across different time zones.",
    },
    {
      displayName: "Timezone",
      name: "timezone",
      type: "string",
      default: "UTC",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "Timezone for the scheduled post. Use standard timezone names like 'America/New_York', 'Europe/London', 'Asia/Tokyo', etc. Defaults to UTC if not specified.",
      placeholder: "America/New_York",
    },
    {
      displayName: "Publish Now",
      name: "publishNow",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "Publish the post immediately instead of scheduling it. When enabled, 'Scheduled For' will be ignored and the post will be published right away.",
    },
    {
      displayName: "Is Draft",
      name: "isDraft",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "Save as draft instead of scheduling or publishing. Drafts don't count toward your upload limits and can be edited later before publishing.",
    },
    {
      displayName: "Visibility",
      name: "visibility",
      type: "options",
      options: [
        {
          name: "Public",
          value: "public",
          description: "Visible to everyone",
        },
        {
          name: "Private",
          value: "private",
          description: "Only visible to followers/connections",
        },
        {
          name: "Unlisted",
          value: "unlisted",
          description:
            "Not shown in public feeds but accessible via direct link",
        },
      ],
      default: "public",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "Who can see this post. Note: Not all platforms support all visibility options. Platform-specific defaults will be used when not supported.",
    },
    {
      displayName: "Tags",
      name: "tags",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
        },
      },
      description:
        "Comma-separated tags/keywords for the post. Primarily used by YouTube for search optimization (500 char limit, ~15 tags max). Keep tags relevant and descriptive.",
      placeholder: "programming, tutorial, automation, n8n",
    },
  ];
}

/**
 * Builds list operation fields
 */
export function buildListFields(): INodeProperties[] {
  return [
    {
      displayName: "Page",
      name: "page",
      type: "number",
      default: 1,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Page number",
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 10,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Posts per page (max 100)",
    },
    {
      displayName: "Status",
      name: "status",
      type: "options",
      options: [
        { name: "All", value: "" },
        { name: "Draft", value: "draft" },
        { name: "Scheduled", value: "scheduled" },
        { name: "Published", value: "published" },
        { name: "Failed", value: "failed" },
      ],
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter by status",
    },
    {
      displayName: "Platform",
      name: "platform",
      type: "options",
      options: [
        { name: "All", value: "" },
        ...SUPPORTED_PLATFORMS.map((platform) => ({
          name: platform.name,
          value: platform.value,
        })),
      ],
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter by platform",
    },
  ];
}

