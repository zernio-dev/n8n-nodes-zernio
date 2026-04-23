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
          url: "/v1/posts",
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
          url: "=/v1/posts/{{ $parameter.postId }}",
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
          url: "/v1/posts",
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
          url: "=/v1/posts/{{ $parameter.postId }}",
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
          url: "=/v1/posts/{{ $parameter.postId }}",
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
          url: "=/v1/posts/{{ $parameter.postId }}/retry",
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
          url: "=/v1/posts/{{ $parameter.postId }}/unpublish",
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
      name: "Edit",
      value: "edit",
      action: "Edit published post",
      routing: {
        request: {
          method: "POST",
          url: "=/v1/posts/{{ $parameter.postId }}/edit",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
          body: {
            platform: "={{ $parameter.editPlatform }}",
            content: "={{ $parameter.editContent }}",
          },
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Update Metadata",
      value: "updateMetadata",
      action: "Update post metadata",
      routing: {
        request: {
          method: "POST",
          url: "=/v1/posts/{{ $parameter.postId }}/update-metadata",
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
          body: {
            platform: "={{ $parameter.metadataPlatform }}",
            videoId: "={{ $parameter.videoId || undefined }}",
            accountId: "={{ $parameter.accountId || undefined }}",
            title: "={{ $parameter.videoTitle || undefined }}",
            description: "={{ $parameter.videoDescription || undefined }}",
            tags: "={{ $parameter.videoTags || undefined }}",
            categoryId: "={{ $parameter.categoryId || undefined }}",
            privacyStatus: "={{ $parameter.privacyStatus || undefined }}",
            thumbnailUrl: "={{ $parameter.thumbnailUrl || undefined }}",
            madeForKids: "={{ $parameter.madeForKids ?? undefined }}",
            containsSyntheticMedia: "={{ $parameter.containsSyntheticMedia ?? undefined }}",
            playlistId: "={{ $parameter.playlistId || undefined }}",
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
          url: "/v1/posts/bulk-upload",
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
      description:
        "Create Bluesky threads with multiple posts. Each post supports up to 300 characters. Only the first post can include media.",
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

    // Edit fields
    {
      displayName: "Platform",
      name: "editPlatform",
      type: "options",
      options: [{ name: "Twitter/X", value: "twitter" }],
      default: "twitter",
      required: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["edit"],
        },
      },
      description: "The platform to edit the post on. Currently only Twitter/X is supported.",
    },
    {
      displayName: "Content",
      name: "editContent",
      type: "string",
      typeOptions: {
        rows: 3,
      },
      default: "",
      required: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["edit"],
        },
      },
      description: "The new text content. Media edits are not supported.",
      placeholder: "Updated tweet text with corrected information",
    },

    // Update metadata fields (YouTube)
    {
      displayName: "Platform",
      name: "metadataPlatform",
      type: "options",
      options: [{ name: "YouTube", value: "youtube" }],
      default: "youtube",
      required: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description: "The platform to update metadata on. Currently only YouTube is supported.",
    },
    {
      displayName: "Video ID",
      name: "videoId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        'YouTube video ID (required for direct mode). For direct mode, set Post ID to "_" and provide Video ID + Account ID.',
      placeholder: "dQw4w9WgXcQ",
    },
    {
      displayName: "Account ID",
      name: "accountId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        'Zernio social account ID for the connected YouTube channel (required for direct mode). For direct mode, set Post ID to "_" and provide Video ID + Account ID.',
      placeholder: "68fb37418bbca9c10cbfef26",
    },
    {
      displayName: "Title",
      name: "videoTitle",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description: "New video title (YouTube max 100 characters).",
      placeholder: "Updated Video Title",
    },
    {
      displayName: "Description",
      name: "videoDescription",
      type: "string",
      typeOptions: {
        rows: 4,
      },
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description: "New video description.",
      placeholder: "New SEO-optimized description",
    },
    {
      displayName: "Tags",
      name: "videoTags",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        "Comma-separated list of keyword tags. YouTube constraints: each tag max 100 chars, combined max 500 chars.",
      placeholder: "seo, marketing, tutorial",
    },
    {
      displayName: "Category ID",
      name: "categoryId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description: "YouTube video category ID.",
      placeholder: "27",
    },
    {
      displayName: "Privacy Status",
      name: "privacyStatus",
      type: "options",
      options: [
        { name: "Public", value: "public" },
        { name: "Private", value: "private" },
        { name: "Unlisted", value: "unlisted" },
      ],
      default: "public",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description: "Video privacy setting.",
    },
    {
      displayName: "Thumbnail URL",
      name: "thumbnailUrl",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        "Public URL of a custom thumbnail image (JPEG/PNG/GIF, max 2 MB, recommended 1280x720). Channel must be verified to set custom thumbnails.",
      placeholder: "https://example.com/my-thumbnail.jpg",
    },
    {
      displayName: "Made for Kids",
      name: "madeForKids",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        "COPPA compliance flag. Set true for child-directed content (restricts comments, notifications, ad targeting).",
    },
    {
      displayName: "Contains Synthetic Media",
      name: "containsSyntheticMedia",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        "AI-generated content disclosure. Set true if the video contains synthetic content that could be mistaken for real.",
    },
    {
      displayName: "Playlist ID",
      name: "playlistId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["updateMetadata"],
        },
      },
      description:
        "YouTube playlist ID to add the video to (e.g. 'PLxxxxxxxxxxxxx'). Only playlists owned by the channel are supported.",
      placeholder: "PLxxxxxxxxxxxxx",
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

    // Common identifier fields for operations that require a postId
    {
      displayName: "Post ID",
      name: "postId",
      type: "string",
      default: "",
      required: true,
      displayOptions: {
        show: {
          resource: ["posts"],
          operation: ["get", "update", "delete", "retry", "unpublish", "logs", "edit", "updateMetadata"],
        },
      },
      description:
        'The unique identifier of the post. For Update Metadata direct mode, set this to "_" and provide Video ID + Account ID.',
      placeholder: "64e1f0a9e2b5af0012ab34cd",
    },
  ],
};