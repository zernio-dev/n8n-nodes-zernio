import type { LateResourceModule } from "../types";

export const webhooksResource: LateResourceModule = {
	operations: [
		{
			name: "Get Settings",
			value: "get",
			action: "Get webhook settings",
			routing: {
				request: {
					method: "GET",
					url: "/v1/webhooks/settings",
				},
			},
		},
		{
			name: "Create Settings",
			value: "create",
			action: "Create webhook settings",
			routing: {
				request: {
					method: "POST",
					url: "/v1/webhooks/settings",
					body: {
						name: "={{ $parameter.name }}",
						url: "={{ $parameter.url }}",
						secret: "={{ $parameter.secret || undefined }}",
						events: "={{ $parameter.events }}",
						isActive: "={{ $parameter.isActive }}",
						customHeaders: "={{ $parameter.customHeaders || undefined }}",
					},
				},
			},
		},
		{
			name: "Update Settings",
			value: "update",
			action: "Update webhook settings",
			routing: {
				request: {
					method: "PUT",
					url: "/v1/webhooks/settings",
					body: {
						_id: "={{ $parameter.webhookId }}",
						name: "={{ $parameter.name || undefined }}",
						url: "={{ $parameter.url || undefined }}",
						secret: "={{ $parameter.secret || undefined }}",
						events: "={{ $parameter.events || undefined }}",
						isActive: "={{ $parameter.isActive }}",
						customHeaders: "={{ $parameter.customHeaders || undefined }}",
					},
				},
			},
		},
		{
			name: "Delete Settings",
			value: "delete",
			action: "Delete webhook settings",
			routing: {
				request: {
					method: "DELETE",
					url: "/v1/webhooks/settings",
					qs: {
						id: "={{ $parameter.webhookId }}",
					},
				},
			},
		},
		{
			name: "Test Webhook",
			value: "test",
			action: "Send test webhook",
			routing: {
				request: {
					method: "POST",
					url: "/v1/webhooks/test",
					body: {
						webhookId: "={{ $parameter.webhookId }}",
					},
				},
			},
		},
	],

	fields: [
		// Webhook ID (used by multiple operations)
		{
			displayName: "Webhook ID",
			name: "webhookId",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["update", "delete", "test"],
				},
			},
			description: "The unique identifier of the webhook",
			placeholder: "507f1f77bcf86cd799439011",
			required: true,
		},

		// Webhook name
		{
			displayName: "Name",
			name: "name",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description: "Webhook name (1-50 characters)",
			placeholder: "My Production Webhook",
			required: true,
		},

		// Webhook URL
		{
			displayName: "Webhook URL",
			name: "url",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description:
				"Webhook endpoint URL (must be a valid URL; whitespace is trimmed before validation)",
			placeholder: "https://your-server.com/webhook",
			required: true,
		},

		// Secret for signature verification
		{
			displayName: "Secret",
			name: "secret",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description:
				"Secret key for signing webhook payloads. Used to verify webhook authenticity via HMAC-SHA256 signature.",
			placeholder: "your-webhook-secret",
		},

		// Events to subscribe to
		{
			displayName: "Events",
			name: "events",
			type: "multiOptions",
			options: [
				{
					name: "Post Scheduled",
					value: "post.scheduled",
					description: "Triggered when a post is scheduled",
				},
				{
					name: "Post Published",
					value: "post.published",
					description: "Triggered when a post is successfully published",
				},
				{
					name: "Post Failed",
					value: "post.failed",
					description: "Triggered when a post fails to publish",
				},
				{
					name: "Post Partial",
					value: "post.partial",
					description:
						"Triggered when a post partially succeeds (some platforms failed)",
				},
				{
					name: "Post Cancelled",
					value: "post.cancelled",
					description: "Triggered when a scheduled post is cancelled",
				},
				{
					name: "Post Recycled",
					value: "post.recycled",
					description: "Triggered when a post is recycled",
				},
				{
					name: "Account Connected",
					value: "account.connected",
					description: "Triggered when a new social account is connected",
				},
				{
					name: "Account Disconnected",
					value: "account.disconnected",
					description:
						"Triggered when a social account is disconnected or expires",
				},
				{
					name: "Message Received",
					value: "message.received",
					description: "Triggered when a new DM/message is received",
				},
				{
					name: "Comment Received",
					value: "comment.received",
					description: "Triggered when a new comment is received",
				},
				{
					name: "Review New",
					value: "review.new",
					description: "Triggered when a new review is received",
				},
				{
					name: "Review Updated",
					value: "review.updated",
					description: "Triggered when a review is updated",
				},
			],
			default: ["post.published", "post.failed"],
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description: "Select which events should trigger webhook notifications",
			required: true,
		},

		// Active status
		{
			displayName: "Is Active",
			name: "isActive",
			type: "boolean",
			default: true,
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description:
				"Enable or disable webhook delivery. Defaults to true when omitted. Webhooks may be automatically disabled after consecutive delivery failures.",
		},

		// Custom headers
		{
			displayName: "Custom Headers",
			name: "customHeaders",
			type: "json",
			default: {},
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description:
				"Custom headers to include in webhook requests (JSON object of key/value pairs)",
			placeholder: '{ "X-Custom-Header": "value" }',
		},
	],
};