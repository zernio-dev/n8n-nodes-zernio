// Post operations: create, update, delete, get, list scheduled social media posts
import type { LateResourceModule } from "../types";
import { postsCreatePreSend, postsUpdatePreSend, handleApiErrorResponse } from "../utils/routingHooks";
import {
  buildPlatformSelector,
  buildAccountSelectors,
  buildMediaItemsField,
  buildCommonPostFields,
  buildListFields,
} from "../utils/fieldBuilders";

export const postsResource: LateResourceModule = {
  operations: [
    {
      name: "List",
      value: "list",
      action: "List posts",
      routing: {
        request: {
          method: "GET",
          url: "/posts",
          qs: {
            page: "={{ $parameter.page || 1 }}",
            limit: "={{ $parameter.limit || 10 }}",
            status: "={{ $parameter.status || undefined }}",
            platform: "={{ $parameter.platform || undefined }}",
            profileId: "={{ $parameter.profileId || undefined }}",
            createdBy: "={{ $parameter.createdBy || undefined }}",
            dateFrom: "={{ $parameter.dateFrom || undefined }}",
            dateTo: "={{ $parameter.dateTo || undefined }}",
            includeHidden: "={{ $parameter.includeHidden ?? undefined }}",
            search: "={{ $parameter.search || undefined }}",
            sortBy: "={{ $parameter.sortBy || undefined }}",
          },
        },
      },
    },
    {
      name: "Get",
      value: "get",
      action: "Get post",
      routing: {
        request: {
          method: "GET",
          url: "=/posts/{{ $parameter.postId }}",
        },
      },
    },
    {
      name: "Create",
      value: "create",
      action: "Create post",
      routing: {
        request: {
          method: "POST",
          url: "/posts",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
        },
        send: {
          preSend: [postsCreatePreSend],
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Update",
      value: "update",
      action: "Update post",
      routing: {
        request: {
          method: "PUT",
          url: "=/posts/{{ $parameter.postId }}",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
        },
        send: {
          preSend: [postsUpdatePreSend],
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Delete",
      value: "delete",
      action: "Delete post",
      routing: {
        request: {
          method: "DELETE",
          url: "=/posts/{{ $parameter.postId }}",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Retry",
      value: "retry",
      action: "Retry failed post",
      routing: {
        request: {
          method: "POST",
          url: "=/posts/{{ $parameter.postId }}/retry",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Unpublish",
      value: "unpublish",
      action: "Unpublish post",
      routing: {
        request: {
          method: "POST",
          url: "=/posts/{{ $parameter.postId }}/unpublish",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
          body: {
            platform: "={{ $parameter.unpublishPlatform }}",
          },
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Bulk Upload",
      value: "bulkUpload",
      action: "Bulk upload posts from CSV",
      routing: {
        request: {
          method: "POST",
          url: "/posts/bulk-upload",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          qs: {
            dryRun: "={{ $parameter.dryRun || false }}",
          },
          body: {
            file: "={{ { value: $parameter.csvFile, options: { filename: 'bulk-upload.csv', contentType: 'text/csv' } } }}",
          },
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Get Logs",
      value: "logs",
      action: "Get post publishing logs",
      routing: {
        request: {
          method: "GET",
          url: "=/posts/{{ $parameter.postId }}/logs",
        },
      },
    },
  ],

  fields: [
    // Common fields
    ...buildCommonPostFields(),

    // Platform selection
    buildPlatformSelector(),

    // Account selectors for all platforms
    ...buildAccountSelectors(),

    // Media items with proper variable handling
    buildMediaItemsField(),

    // Twitter Thread Fields
    {
      displayName: "Twitter Thread Items",
      name: "twitterThreadItems",
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
          selectedPlatforms: ["twitter"],
        },
      },
      description:
        "Create Twitter/X threads with multiple tweets. Each tweet supports up to 280 characters. Only the first tweet can include media.",
      options: [
        {
          name: "items",
          displayName: "Thread Items",
          values: [
            {
              displayName: "Content",
              name: "content",
              type: "string",
              typeOptions: {
                rows: 3,
              },
              default: "",
              description: "Content of this tweet (280 characters max)",
              placeholder: "This is tweet 1 of my thread...",
              required: true,
            },
            {
              displayName: "Media Items",
              name: "mediaItems",
              type: "fixedCollection",
              default: { items: [] },
              typeOptions: {
                multipleValues: true,
              },
              description: "Media files for this tweet. Note: Only the first tweet in a thread can have media.",
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
                        { name: "Image", value: "image" },
                        { name: "Video", value: "video" },
                        { name: "GIF", value: "gif" },
                        { name: "Document", value: "document" },
                      ],
                      default: "image",
                      description: "Type of media file",
                    },
                    {
                      displayName: "URL",
                      name: "url",
                      type: "string",
                      default: "",
                      noDataExpression: false,
                      description:
                        "URL of the uploaded media file. You can use expressions like ={{ 'https://' + $json.data.color + '.com' }}",
                      required: true,
                    },
                    {
                      displayName: "Filename",
                      name: "filename",
                      type: "string",
                      default: "",
                      description: "Optional filename",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Threads Conversation Fields
    {
      displayName: "Threads Conversation Items",
      name: "threadsThreadItems",
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
          selectedPlatforms: ["threads"],
        },
      },
      description:
        "Create Threads conversations with multiple posts. Each post supports up to 500 characters. Only the first post can include media.",
      options: [
        {
          name: "items",
          displayName: "Conversation Items",
          values: [
            {
              displayName: "Content",
              name: "content",
              type: "string",
              typeOptions: {
                rows: 3,
              },
              default: "",
              description: "Content of this post (500 characters max)",
              placeholder: "This is post 1 of my conversation...",
              required: true,
            },
            {
              displayName: "Media Items",
              name: "mediaItems",
              type: "fixedCollection",
              default: { items: [] },
              typeOptions: {
                multipleValues: true,
              },
              description: "Media files for this post. Note: Only the first post in a conversation can have media.",
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
                        { name: "Image", value: "image" },
                        { name: "Video", value: "video" },
                        { name: "GIF", value: "gif" },
                        { name: "Document", value: "document" },
                      ],
                      default: "image",
                      description: "Type of media file",
                    },
                    {
                      displayName: "URL",
                      name: "url",
                      type: "string",
                      default: "",
                      noDataExpression: false,
                      description:
                        "URL of the uploaded media file. You can use expressions like ={{ 'https://' + $json.data.color + '.com' }}",
                      required: true,
                    },
                    {
                      displayName: "Filename",
                      name: "filename",
                      type: "string",
                      default: "",
                      description: "Optional filename",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Bluesky Thread Fields
    {
      displayName: "Bluesky Thread Items",
      name: "blueskyThreadItems",
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
          selectedPlatforms: ["bluesky"],
        },
      },
      description: "Create Bluesky threads with multiple posts. Each post supports up to 300 characters. Only the first post can include media.",
      options: [
        {
          name: "items",
          displayName: "Thread Items",
          values: [
            {
              displayName: "Content",
              name: "content",
              type: "string",
              typeOptions: {
                rows: 3,
              },
              default: "",
              description: "Content of this post (300 characters max)",
              placeholder: "This is post 1 of my thread...",
              required: true,
            },
            {
              displayName: "Media Items",
              name: "mediaItems",
              type: "fixedCollection",
              default: { items: [] },
              typeOptions: {
                multipleValues: true,
              },
              description: "Media files for this post. Note: Only the first post in a thread can have media.",
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
                        { name: "Image", value: "image" },
                        { name: "Video", value: "video" },
                        { name: "GIF", value: "gif" },
                        { name: "Document", value: "document" },
                      ],
                      default: "image",
                      description: "Type of media file",
                    },
                    {
                      displayName: "URL",
                      name: "url",
                      type: "string",
                      default: "",
                      noDataExpression: false,
                      description:
                        "URL of the uploaded media file. You can use expressions like ={{ 'https://' + $json.data.color + '.com' }}",
                      required: true,
                    },
                    {
                      displayName: "Filename",
                      name: "filename",
                      type: "string",
                      default: "",
                      description: "Optional filename",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // TikTok Settings
    {
      displayName: "TikTok Privacy Level",
      name: "tiktokPrivacyLevel",
      type: "options",
      options: [
        { name: "Public to Everyone", value: "PUBLIC_TO_EVERYONE" },
        { name: "Followers Only", value: "MUTUAL_FOLLOW_FRIENDS" },
        { name: "Friends Only", value: "SELF_ONLY" },
      ],
      default: "PUBLIC_TO_EVERYONE",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
          selectedPlatforms: ["tiktok"],
        },
      },
      description: "Who can see your TikTok video",
    },
    {
      displayName: "Allow Comments",
      name: "tiktokAllowComments",
      type: "boolean",
      default: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
          selectedPlatforms: ["tiktok"],
        },
      },
      description: "Allow comments on this TikTok video",
    },
    {
      displayName: "Allow Duets",
      name: "tiktokAllowDuet",
      type: "boolean",
      default: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
          selectedPlatforms: ["tiktok"],
        },
      },
      description: "Allow other users to create duets with this video",
    },
    {
      displayName: "Allow Stitches",
      name: "tiktokAllowStitch",
      type: "boolean",
      default: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["create", "update"],
          selectedPlatforms: ["tiktok"],
        },
      },
      description: "Allow other users to stitch this video",
    },

    // Unpublish fields
    {
      displayName: "Platform",
      name: "unpublishPlatform",
      type: "options",
      options: [
        { name: "Threads", value: "threads" },
        { name: "Facebook", value: "facebook" },
        { name: "Twitter/X", value: "twitter" },
        { name: "LinkedIn", value: "linkedin" },
        { name: "YouTube", value: "youtube" },
        { name: "Pinterest", value: "pinterest" },
        { name: "Reddit", value: "reddit" },
        { name: "Bluesky", value: "bluesky" },
        { name: "Google Business", value: "googlebusiness" },
        { name: "Telegram", value: "telegram" },
      ],
      default: "twitter",
      required: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["unpublish"],
        },
      },
      description:
        "The platform to delete the published post from. Not supported on Instagram, TikTok, or Snapchat. Threaded posts delete all items; YouTube deletion is permanent.",
    },

    // Bulk upload fields
    {
      displayName: "CSV File",
      name: "csvFile",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["bulkUpload"],
        },
      },
      description:
        "Base64 encoded CSV file content. CSV should have columns: content, scheduledFor, timezone, platforms, mediaUrls (optional). Use n8n's 'Read Binary File' node to get the file data.",
      placeholder: "data:text/csv;base64,...",
      required: true,
    },
    {
      displayName: "Dry Run",
      name: "dryRun",
      type: "boolean",
      default: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["bulkUpload"],
        },
      },
      description: "If true, validates the CSV without creating posts. Use this to check for errors before actual upload.",
    },

    // List filters
    ...buildListFields(),

    // Additional list filters (v1)
    {
      displayName: "Profile ID",
      name: "profileId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter posts by profile ID",
      placeholder: "64e1f0a9e2b5af0012ab34cd",
    },
    {
      displayName: "Created By",
      name: "createdBy",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter posts by creator user ID",
      placeholder: "64e1f0a9e2b5af0012ab34cd",
    },
    {
      displayName: "Date From",
      name: "dateFrom",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter posts created on/after this date (YYYY-MM-DD)",
      placeholder: "2025-01-01",
    },
    {
      displayName: "Date To",
      name: "dateTo",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Filter posts created on/before this date (YYYY-MM-DD)",
      placeholder: "2025-01-31",
    },
    {
      displayName: "Include Hidden",
      name: "includeHidden",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "If true, includes hidden posts in results",
    },
    {
      displayName: "Search",
      name: "search",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Search posts by text content",
      placeholder: "launch",
    },
    {
      displayName: "Sort By",
      name: "sortBy",
      type: "options",
      options: [
        { name: "Scheduled (Newest First)", value: "scheduled-desc" },
        { name: "Scheduled (Oldest First)", value: "scheduled-asc" },
        { name: "Created (Newest First)", value: "created-desc" },
        { name: "Created (Oldest First)", value: "created-asc" },
        { name: "Status", value: "status" },
        { name: "Platform", value: "platform" },
      ],
      default: "scheduled-desc",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["list"],
        },
      },
      description: "Sort order for results",
    },
  ],
};