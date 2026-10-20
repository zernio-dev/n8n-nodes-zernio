import type { IExecuteFunctions } from "n8n-workflow";

/**
 * Recursively processes an object and evaluates n8n expressions
 * This is a reusable utility that can handle any nested structure
 */
export function processExpressions(
  obj: any,
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      processExpressions(item, executeFunctions, itemIndex)
    );
  }

  // Handle objects
  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = processExpressions(value, executeFunctions, itemIndex);
    }
    return result;
  }

  // Handle strings that might contain expressions
  if (typeof obj === "string") {
    return evaluateStringExpression(obj, executeFunctions, itemIndex);
  }

  // Return primitive values as-is
  return obj;
}

/**
 * Evaluates a string expression, handling various n8n expression formats
 */
function evaluateStringExpression(
  str: string,
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): any {
  if (!str || typeof str !== "string") {
    return str;
  }

  // Check if it contains n8n expressions
  if (str.includes("{{") && str.includes("}}")) {
    try {
      // Convert legacy format: "=https://{{ $json.data.color }}.com"
      // to new format: "={{ 'https://' + $json.data.color + '.com' }}"
      if (str.startsWith("=") && str.includes("{{")) {
        str = convertLegacyExpression(str);
      }

      // If it's a full expression (starts with ={{), evaluate it
      if (str.startsWith("={{") && str.endsWith("}}")) {
        return executeFunctions.evaluateExpression(str, itemIndex);
      }

      // If it contains expressions but isn't a full expression,
      // convert it to a template literal format
      if (str.includes("{{") && str.includes("}}")) {
        const convertedExpression = convertToTemplateExpression(str);
        return executeFunctions.evaluateExpression(
          convertedExpression,
          itemIndex
        );
      }
    } catch (error) {
      // Return the original string if evaluation fails
      return str;
    }
  }

  return str;
}

/**
 * Quotes a static text segment as a JS single-quoted string, escaping
 * backslashes, quotes and newlines so segments like "It's" produce a valid
 * expression instead of silently failing evaluation.
 */
function quoteStatic(text: string): string {
  return `'${text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")}'`;
}

/**
 * Converts legacy expression format to new format
 * Example: "=https://{{ $json.data.color }}.com" -> "={{ 'https://' + $json.data.color + '.com' }}"
 */
function convertLegacyExpression(str: string): string {
  // Remove the leading "="
  const withoutEquals = str.substring(1);

  // Split by {{ and }} to identify static parts and expressions
  const parts: string[] = [];
  let currentPart = "";
  let inExpression = false;
  let i = 0;

  while (i < withoutEquals.length) {
    if (withoutEquals.substring(i, i + 2) === "{{") {
      if (currentPart) {
        parts.push(quoteStatic(currentPart));
        currentPart = "";
      }
      inExpression = true;
      i += 2;
    } else if (withoutEquals.substring(i, i + 2) === "}}" && inExpression) {
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = "";
      }
      inExpression = false;
      i += 2;
    } else {
      currentPart += withoutEquals[i];
      i++;
    }
  }

  if (currentPart) {
    if (inExpression) {
      parts.push(currentPart.trim());
    } else {
      parts.push(quoteStatic(currentPart));
    }
  }

  return `={{ ${parts.join(" + ")} }}`;
}

/**
 * Converts mixed text with expressions to a template expression
 * Example: "Hello {{ $json.name }}!" -> "={{ 'Hello ' + $json.name + '!' }}"
 */
function convertToTemplateExpression(str: string): string {
  const parts: string[] = [];
  let currentPart = "";
  let inExpression = false;
  let i = 0;

  while (i < str.length) {
    if (str.substring(i, i + 2) === "{{") {
      if (currentPart) {
        parts.push(quoteStatic(currentPart));
        currentPart = "";
      }
      inExpression = true;
      i += 2;
    } else if (str.substring(i, i + 2) === "}}" && inExpression) {
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = "";
      }
      inExpression = false;
      i += 2;
    } else {
      currentPart += str[i];
      i++;
    }
  }

  if (currentPart) {
    if (inExpression) {
      parts.push(currentPart.trim());
    } else {
      parts.push(quoteStatic(currentPart));
    }
  }

  return `={{ ${parts.join(" + ")} }}`;
}

/**
 * Configuration for which parameters should be processed for expressions
 * This allows for extensible configuration without hardcoding
 */
export const EXPRESSION_PROCESSING_CONFIG = {
  posts: {
    create: ["mediaItems", "twitterThreadItems", "threadsThreadItems"],
    update: ["mediaItems", "twitterThreadItems", "threadsThreadItems"],
  },
  // Add more resources and operations as needed
  // media: {
  //   upload: ['files']
  // }
};

/**
 * Main function to process parameters that need expression evaluation
 */
export function processParametersWithExpressions(
  resource: string,
  operation: string,
  executeFunctions: IExecuteFunctions,
  itemIndex: number
): Record<string, any> {
  const config =
    EXPRESSION_PROCESSING_CONFIG[
      resource as keyof typeof EXPRESSION_PROCESSING_CONFIG
    ];
  if (!config || !config[operation as keyof typeof config]) {
    return {};
  }

  const parametersToProcess = config[
    operation as keyof typeof config
  ] as string[];
  const processedParameters: Record<string, any> = {};

  for (const paramName of parametersToProcess) {
    const paramValue = executeFunctions.getNodeParameter(
      paramName,
      itemIndex,
      null
    );
    if (paramValue !== null && paramValue !== undefined) {
      processedParameters[paramName] = processExpressions(
        paramValue,
        executeFunctions,
        itemIndex
      );
    }
  }

  return processedParameters;
}
