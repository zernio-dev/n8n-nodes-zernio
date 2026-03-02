import type { INodeProperties } from "n8n-workflow";

/**
 * Common field builders for reuse across different resources
 */

/**
 * Builds a generic ID field for account operations
 */
export function buildAccountIdField(
  resource: string,
  operations: string[],
  displayName: string = "Account ID",
  description: string = "The unique identifier of the account"
): INodeProperties {
  return {
    displayName,
    name: "accountId",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description,
    required: true,
  };
}

/**
 * Builds a profile ID field
 */
export function buildProfileIdField(
  resource: string,
  operations: string[],
  required: boolean = true
): INodeProperties {
  return {
    displayName: "Profile ID",
    name: "profileId",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description: "The unique identifier of the profile",
    required,
  };
}

/**
 * Builds a temp token field for OAuth operations
 */
export function buildTempTokenField(
  resource: string,
  operations: string[]
): INodeProperties {
  return {
    displayName: "Temp Token",
    name: "tempToken",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description: "Temporary OAuth token obtained from the authentication flow",
    required: true,
  };
}

/**
 * Builds user profile fields for OAuth operations
 */
export function buildUserProfileFields(
  resource: string,
  operations: string[],
  platform: string
): INodeProperties[] {
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  return [
    {
      displayName: "User Profile ID",
      name: "userProfileId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
        },
      },
      description: `${platformName} user ID`,
      placeholder: "123456789",
    },
    {
      displayName: "User Profile Name",
      name: "userProfileName",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
        },
      },
      description: `${platformName} user display name`,
      placeholder: "John Doe",
    },
    {
      displayName: "User Profile Email",
      name: "userProfileEmail",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
        },
      },
      description: `${platformName} user email address`,
      placeholder: "john@example.com",
    },
    {
      displayName: "User Profile Picture",
      name: "userProfilePicture",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
        },
      },
      description: "URL to the user's profile picture",
      placeholder: `https://graph.${platform}.com/123456789/picture`,
    },
    {
      displayName: "User Profile Access Token",
      name: "userProfileAccessToken",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
        },
      },
      description: `${platformName} user access token`,
      placeholder: "EAABwzLix...",
    },
  ];
}

/**
 * Builds organization fields for LinkedIn
 */
export function buildOrganizationFields(
  resource: string,
  operations: string[],
  accountTypeField: string = "accountType"
): INodeProperties[] {
  return [
    {
      displayName: "Organization ID",
      name: "organizationId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
          [accountTypeField]: ["organization"],
        },
      },
      description: "LinkedIn organization ID",
      placeholder: "123456",
    },
    {
      displayName: "Organization URN",
      name: "organizationUrn",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
          [accountTypeField]: ["organization"],
        },
      },
      description: "LinkedIn organization URN",
      placeholder: "urn:li:organization:123456",
    },
    {
      displayName: "Organization Name",
      name: "organizationName",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
          [accountTypeField]: ["organization"],
        },
      },
      description: "Organization display name",
      placeholder: "Company Name",
    },
    {
      displayName: "Organization Logo URL",
      name: "organizationLogoUrl",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
          [accountTypeField]: ["organization"],
        },
      },
      description: "URL to the organization's logo",
      placeholder: "https://media.licdn.com/dms/image/...",
    },
    {
      displayName: "Organization Description",
      name: "organizationDescription",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: [resource],
          operation: operations,
          [accountTypeField]: ["organization"],
        },
      },
      description: "Organization description",
      placeholder: "Company description...",
    },
  ];
}

/**
 * Builds account type selector for LinkedIn
 */
export function buildAccountTypeField(
  resource: string,
  operations: string[]
): INodeProperties {
  return {
    displayName: "Account Type",
    name: "accountType",
    type: "options",
    options: [
      { name: "Personal", value: "personal" },
      { name: "Organization", value: "organization" },
    ],
    default: "personal",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description: "Type of LinkedIn account",
  };
}

/**
 * Builds a generic selector field for pages/organizations
 */
export function buildSelectorField(
  resource: string,
  operations: string[],
  fieldName: string,
  displayName: string,
  description: string,
  placeholder?: string,
  required: boolean = false
): INodeProperties {
  return {
    displayName,
    name: fieldName,
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description,
    placeholder,
    required,
  };
}

/**
 * Builds the input mode selector for media upload.
 * Lets users choose between binary input from previous nodes (default, works
 * with all n8n binary data modes including filesystem-v2) and manual base64
 * entry for direct data pasting.
 *
 * @param resource - The resource name (e.g., "media")
 * @param operations - Operations where this field should appear (e.g., ["upload"])
 * @returns INodeProperties for the input mode selector
 */
export function buildMediaInputModeField(
  resource: string,
  operations: string[]
): INodeProperties {
  return {
    displayName: "Input Mode",
    name: "inputMode",
    type: "options",
    options: [
      {
        name: "Binary Input",
        value: "binary",
        description:
          "Use binary data from a previous node (e.g., Read Binary File, HTTP Request, Telegram)",
      },
      {
        name: "Manual (Base64 Data)",
        value: "manual",
        description: "Enter file data as base64 encoded strings",
      },
    ],
    default: "binary",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description:
      'How to provide file data. Use "Binary Input" when files come from previous nodes (recommended). Use "Manual" to paste base64 encoded data directly.',
    required: true,
  };
}

/**
 * Builds the binary property name field for binary input mode.
 * Users specify which binary property from the incoming n8n item to read.
 * Most n8n nodes output binary data under the property name "data" by default.
 *
 * @param resource - The resource name (e.g., "media")
 * @param operations - Operations where this field should appear (e.g., ["upload"])
 * @returns INodeProperties for the binary property name input
 */
export function buildBinaryPropertyField(
  resource: string,
  operations: string[]
): INodeProperties {
  return {
    displayName: "Binary Property",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
        inputMode: ["binary"],
      },
    },
    description:
      'Name of the binary property from the incoming item. Most nodes output binary data as "data". Check the output of the previous node if uploads fail.',
    placeholder: "data",
    required: true,
  };
}

/**
 * Builds media upload files field
 */
export function buildMediaFilesField(
  resource: string,
  operations: string[]
): INodeProperties {
  return {
    displayName: "Files",
    name: "files",
    type: "fixedCollection",
    default: { items: [] },
    typeOptions: {
      multipleValues: true,
      sortable: true,
    },
    displayOptions: {
      show: {
        resource: [resource],
        operation: operations,
      },
    },
    description:
      "Files to upload for use in posts. Supports images (JPEG, PNG, WebP, GIF) and videos (MP4, MOV, AVI, WebM) up to 5GB. For large files (>4MB), use the @vercel/blob client-upload method described in the documentation.",
    required: true,
    options: [
      {
        name: "items",
        displayName: "Files",
        values: [
          {
            displayName: "Filename",
            name: "filename",
            type: "string",
            default: "",
            description: "Name of the file including extension",
            placeholder: "image.jpg",
            required: true,
          },
          {
            displayName: "File Data",
            name: "data",
            type: "string",
            default: "",
            description: "Base64 encoded file data or binary data",
            placeholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
            required: true,
          },
          {
            displayName: "MIME Type",
            name: "mimeType",
            type: "options",
            options: [
              { name: "JPEG Image", value: "image/jpeg" },
              { name: "PNG Image", value: "image/png" },
              { name: "WebP Image", value: "image/webp" },
              { name: "GIF Image", value: "image/gif" },
              { name: "MP4 Video", value: "video/mp4" },
              { name: "MOV Video", value: "video/quicktime" },
              { name: "AVI Video", value: "video/x-msvideo" },
              { name: "WebM Video", value: "video/webm" },
              { name: "PDF Document", value: "application/pdf" },
              { name: "Other", value: "application/octet-stream" },
            ],
            default: "image/jpeg",
            description: "MIME type of the file",
            required: true,
          },
          {
            displayName: "File Size (bytes)",
            name: "fileSize",
            type: "number",
            default: 0,
            description: "Size of the file in bytes (optional, for validation)",
            placeholder: "1048576",
          },
        ],
      },
    ],
  };
}
