import FormData from "form-data";
import { processParametersWithExpressions } from "./expressionProcessor";

/**
 * Utility functions for routing hooks that process expressions
 */

/**
 * Post-receive hook that surfaces API error messages in n8n UI.
 * Requires ignoreHttpStatusErrors: true and returnFullResponse: true on the request.
 */
export async function handleApiErrorResponse(
  this: any,
  items: any[],
  responseData: any,
): Promise<any[]> {
  const statusCode = responseData?.statusCode;
  if (statusCode && statusCode >= 400) {
    const body = responseData.body;
    let errorMessage = `LATE API Error (${statusCode})`;

    if (typeof body === 'object' && body !== null) {
      if (body.error) errorMessage += `: ${body.error}`;
      if (body.details) {
        errorMessage += ` - ${typeof body.details === 'string' ? body.details : JSON.stringify(body.details)}`;
      }
      if (body.code) errorMessage += ` [${body.code}]`;
    } else if (typeof body === 'string') {
      errorMessage += `: ${body}`;
    }

    throw new Error(errorMessage);
  }
  return items;
}

/**
 * Builds the platforms array from selected platforms and accounts
 */
function buildPlatformsArray(
  executeFunctions: any,
  itemIndex: number
): Array<{ platform: string; accountId: string }> {
  const selectedPlatforms = executeFunctions.getNodeParameter(
    "selectedPlatforms",
    itemIndex,
    []
  ) as string[];
  return selectedPlatforms
    .map((platform: string) => {
      const accountsParam = `${platform}Accounts`;
      const accounts = executeFunctions.getNodeParameter(
        accountsParam,
        itemIndex,
        []
      ) as string[];
      return accounts
        .filter((id: string) => id && id !== "none" && id !== "error" && id.length === 24)
        .map((id: string) => ({
          platform,
          accountId: id,
        }));
    })
    .flat();
}

/**
 * Builds the tags array from comma-separated string
 */
function buildTagsArray(
  executeFunctions: any,
  itemIndex: number,
  allowUndefined = false
): string[] | undefined {
  const tags = executeFunctions.getNodeParameter("tags", itemIndex, "");
  if (!tags) return allowUndefined ? undefined : [];

  return (tags as string)
    .split(",")
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag);
}

/**
 * Builds TikTok settings if TikTok is selected
 */
function buildTikTokSettings(executeFunctions: any, itemIndex: number): any {
  const selectedPlatforms = executeFunctions.getNodeParameter(
    "selectedPlatforms",
    itemIndex,
    []
  ) as string[];
  if (!selectedPlatforms.includes("tiktok")) return undefined;

  return {
    privacyLevel: executeFunctions.getNodeParameter(
      "tiktokPrivacyLevel",
      itemIndex,
      "PUBLIC_TO_EVERYONE"
    ),
    allowComments: executeFunctions.getNodeParameter(
      "tiktokAllowComments",
      itemIndex,
      true
    ),
    allowDuet: executeFunctions.getNodeParameter(
      "tiktokAllowDuet",
      itemIndex,
      true
    ),
    allowStitch: executeFunctions.getNodeParameter(
      "tiktokAllowStitch",
      itemIndex,
      true
    ),
  };
}

/**
 * Pre-send hook for posts create operation
 */
export async function postsCreatePreSend(
  this: any,
  requestOptions: any
): Promise<any> {
  const { processParametersWithExpressions } = await import(
    "./expressionProcessor"
  );

  // Process expressions in parameters that need it
  const processedParams = processParametersWithExpressions(
    "posts",
    "create",
    this,
    0
  );

  // Build platforms and validate before sending
  const platforms = buildPlatformsArray(this, 0);
  const publishNow = this.getNodeParameter("publishNow", 0, false);
  const isDraft = this.getNodeParameter("isDraft", 0, false);

  if (!isDraft && platforms.length === 0) {
    throw new Error(
      'No valid accounts selected. Please select at least one account for each platform you want to post to. ' +
      'If no accounts appear in the dropdown, make sure you have connected accounts in your LATE dashboard (https://zernio.com).'
    );
  }

  // Build the body with processed parameters
  requestOptions.body = {
    content: this.getNodeParameter("content", 0),
    platforms,
    scheduledFor: this.getNodeParameter("scheduledFor", 0, undefined),
    timezone: this.getNodeParameter("timezone", 0, "UTC"),
    publishNow,
    isDraft,
    visibility: this.getNodeParameter("visibility", 0, "public"),
    tags: buildTagsArray(this, 0),
    mediaItems: processedParams.mediaItems?.items || [],
    twitterThread: processedParams.twitterThreadItems?.items || [],
    threadsConversation: processedParams.threadsThreadItems?.items || [],
    blueskyThread: processedParams.blueskyThreadItems?.items || [],
    tiktokSettings: buildTikTokSettings(this, 0),
  };

  return requestOptions;
}

/**
 * Pre-send hook for posts update operation
 */
export async function postsUpdatePreSend(
  this: any,
  requestOptions: any
): Promise<any> {
  const { processParametersWithExpressions } = await import(
    "./expressionProcessor"
  );

  const processedParams = processParametersWithExpressions(
    "posts",
    "update",
    this,
    0
  );

  requestOptions.body = {
    content: this.getNodeParameter("content", 0),
    platforms: buildPlatformsArray(this, 0),
    scheduledFor: this.getNodeParameter("scheduledFor", 0),
    timezone: this.getNodeParameter("timezone", 0),
    publishNow: this.getNodeParameter("publishNow", 0),
    isDraft: this.getNodeParameter("isDraft", 0),
    visibility: this.getNodeParameter("visibility", 0),
    tags: buildTagsArray(this, 0, true), // Allow undefined for updates
    mediaItems: processedParams.mediaItems?.items || [],
    twitterThread: processedParams.twitterThreadItems?.items || [],
    threadsConversation: processedParams.threadsThreadItems?.items || [],
    blueskyThread: processedParams.blueskyThreadItems?.items || [],
    tiktokSettings: buildTikTokSettings(this, 0),
  };

  return requestOptions;
}

/**
 * Pre-send hook for the media upload operation.
 * Handles two input modes to support all n8n binary data storage backends:
 *
 * 1. "binary" mode (default): Reads binary data from the incoming n8n item
 *    using helpers.getBinaryDataBuffer(). This correctly materializes the file
 *    bytes regardless of whether n8n stores them in-memory (default mode) or
 *    on disk (filesystem-v2 mode on n8n Cloud). Solves the "No files provided"
 *    error that occurs when filesystem-v2 IBinaryData metadata objects are
 *    passed as string values instead of actual file bytes.
 *
 * 2. "manual" mode: Reads base64-encoded data from the files fixedCollection
 *    parameter. Decodes to Buffer for multipart upload. This preserves backward
 *    compatibility for users who paste base64 data directly.
 *
 * In both modes, constructs a FormData body with files appended under the
 * "files" field name, which the Late API expects (formData.getAll('files')
 * on the server at /api/v1/media/route.ts).
 *
 * @param requestOptions - The HTTP request options to modify
 * @returns Modified request options with FormData body and proper headers
 */
export async function mediaUploadPreSend(
  this: any,
  requestOptions: any
): Promise<any> {
  const inputMode = this.getNodeParameter("inputMode", 0, "binary") as string;
  const formData = new FormData();

  if (inputMode === "binary") {
    // Binary mode: read binary data from the incoming n8n item.
    // getBinaryDataBuffer handles both in-memory and filesystem-v2 storage
    // backends transparently, which is the core fix for the reported issue.
    const binaryPropertyName = this.getNodeParameter(
      "binaryPropertyName",
      0,
      "data"
    ) as string;

    // Retrieve the actual file bytes. The function signature varies between
    // IExecuteSingleFunctions (1 arg: propertyName) and IExecuteFunctions
    // (2 args: itemIndex, propertyName). We try both for robustness since
    // the Late node uses `this: any` and n8n's routing engine may provide
    // either interface depending on version.
    let fileBuffer: Buffer;
    try {
      fileBuffer = await this.helpers.getBinaryDataBuffer(
        0,
        binaryPropertyName
      );
    } catch {
      fileBuffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error(
        `No binary data found in property "${binaryPropertyName}". ` +
          "Make sure a previous node (e.g., Read Binary File, HTTP Request, " +
          'Telegram) outputs binary data with this property name. Check the "Binary" ' +
          "tab in the previous node's output to verify the property name."
      );
    }

    // Extract filename and mimeType from the binary metadata object.
    // Try multiple access patterns for compatibility across n8n contexts.
    let filename = "upload";
    let mimeType = "application/octet-stream";

    try {
      // IExecuteFunctions style: getInputData returns all items
      const inputData = this.getInputData();
      const binaryMeta = inputData?.[0]?.binary?.[binaryPropertyName];
      if (binaryMeta) {
        filename = binaryMeta.fileName || filename;
        mimeType = binaryMeta.mimeType || mimeType;
      }
    } catch {
      // Fallback: evaluate an expression to access $binary metadata
      try {
        const binaryMeta = this.evaluateExpression(
          `={{$binary["${binaryPropertyName}"]}}`,
          0
        );
        if (binaryMeta && typeof binaryMeta === "object") {
          filename = (binaryMeta as any).fileName || filename;
          mimeType = (binaryMeta as any).mimeType || mimeType;
        }
      } catch {
        // Use defaults if we cannot read metadata
      }
    }

    // Append file to FormData. The form-data package handles Buffer directly
    // and generates proper Content-Disposition headers with the filename.
    formData.append("files", fileBuffer, {
      filename,
      contentType: mimeType,
    });
  } else {
    // Manual mode: decode base64 data from the files fixedCollection parameter.
    // This preserves the original behavior for users pasting base64 data.
    const filesParam = this.getNodeParameter("files", 0, { items: [] }) as {
      items: Array<{
        filename: string;
        data: string;
        mimeType: string;
        fileSize?: number;
      }>;
    };

    const items = filesParam?.items || [];

    if (items.length === 0) {
      throw new Error(
        "No files provided. Add at least one file in the Files collection."
      );
    }

    for (const item of items) {
      // Strip data URI prefix if present (e.g., "data:image/jpeg;base64,/9j/...")
      let base64Data = item.data;
      if (base64Data.includes(",")) {
        base64Data = base64Data.split(",").pop() || "";
      }

      const fileBuffer = Buffer.from(base64Data, "base64");
      const filename = item.filename || "upload";
      const mimeType = item.mimeType || "application/octet-stream";

      formData.append("files", fileBuffer, {
        filename,
        contentType: mimeType,
      });
    }
  }

  // Replace the request body with the constructed FormData.
  // form-data's getHeaders() generates the correct Content-Type header
  // including the multipart boundary, which is required for the server
  // to parse the form data correctly.
  requestOptions.body = formData;
  requestOptions.headers = {
    ...requestOptions.headers,
    ...formData.getHeaders(),
  };

  return requestOptions;
}
