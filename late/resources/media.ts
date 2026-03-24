import type { LateResourceModule } from "../types";
import {
  buildMediaInputModeField,
  buildBinaryPropertyField,
} from "../utils/commonFields";
import {
  mediaUploadPreSend,
  handleApiErrorResponse,
} from "../utils/routingHooks";

export const mediaResource: LateResourceModule = {
  operations: [
    {
      name: "Upload",
      value: "upload",
      action: "Upload media",
      routing: {
        request: {
          method: "POST",
          url: "/media",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Enable full response so postReceive can inspect status codes
          ignoreHttpStatusErrors: true,
          returnFullResponse: true,
        },
        send: {
          // preSend hook constructs the FormData body with proper binary data
          // handling. Supports both filesystem-v2 and default binary modes.
          preSend: [mediaUploadPreSend],
        },
        output: {
          postReceive: [handleApiErrorResponse],
        },
      },
    },
    {
      name: "Get Presigned URL",
      value: "presign",
      action: "Get presigned URL for direct upload",
      routing: {
        request: {
          method: "POST",
          url: "/media/presign",
          body: {
            filename: "={{ $parameter.filename }}",
            contentType: "={{ $parameter.contentType }}",
            size: "={{ $parameter.size }}",
          },
        },
      },
    },
  ],

  fields: [
    // Input mode toggle: binary (default, works with filesystem-v2) vs manual (base64)
    buildMediaInputModeField("media", ["upload"]),

    // Binary property name field (shown only in binary mode)
    buildBinaryPropertyField("media", ["upload"]),

    // Manual files field (shown only in manual mode for backward compatibility)
    {
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
          resource: ["media"],
          operation: ["upload"],
          inputMode: ["manual"],
        },
      },
      description:
        "Files to upload for use in posts. Supports images (JPEG, PNG, WebP, GIF) and videos (MP4, MOV, AVI, WebM) up to 5GB.",
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
              description: "Base64 encoded file data",
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
              description:
                "Size of the file in bytes (optional, for validation)",
              placeholder: "1048576",
            },
          ],
        },
      ],
    },

    // Presign fields (updated)
    {
      displayName: "Filename",
      name: "filename",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["media"],
          operation: ["presign"],
        },
      },
      description: "Name of the file to upload (including extension)",
      placeholder: "my-video.mp4",
      required: true,
    },
    {
      displayName: "Content Type",
      name: "contentType",
      type: "options",
      options: [
        { name: "JPEG Image", value: "image/jpeg" },
        { name: "JPG Image", value: "image/jpg" },
        { name: "PNG Image", value: "image/png" },
        { name: "WebP Image", value: "image/webp" },
        { name: "GIF Image", value: "image/gif" },
        { name: "MP4 Video", value: "video/mp4" },
        { name: "MPEG Video", value: "video/mpeg" },
        { name: "MOV Video", value: "video/quicktime" },
        { name: "AVI Video", value: "video/avi" },
        { name: "AVI Video (x-msvideo)", value: "video/x-msvideo" },
        { name: "WebM Video", value: "video/webm" },
        { name: "M4V Video", value: "video/x-m4v" },
        { name: "PDF Document", value: "application/pdf" },
      ],
      default: "video/mp4",
      displayOptions: {
        show: {
          resource: ["media"],
          operation: ["presign"],
        },
      },
      description:
        "MIME type of the file. Returns uploadUrl and publicUrl. PUT your file to uploadUrl, then use publicUrl in posts.",
      required: true,
    },
    {
      displayName: "Size (bytes)",
      name: "size",
      type: "number",
      default: 0,
      displayOptions: {
        show: {
          resource: ["media"],
          operation: ["presign"],
        },
      },
      description:
        "Optional file size in bytes for pre-validation (max 5GB). Leave empty or 0 to omit.",
      placeholder: "15234567",
    },
  ],
};