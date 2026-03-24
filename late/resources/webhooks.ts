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
					url: "/webhooks/settings",
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
					url: "/webhooks/settings",
					body: {
						name: "={{ $parameter.name || undefined }}",
						url: "={{ $parameter.url }}",
						secret: "={{ $parameter.secret || undefined }}",
						events: "={{ $parameter.events || undefined }}",
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
					url: "/webhooks/settings",
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
					url: "/webhooks/settings",
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
					url: "/webhooks/test",
					body: {
						webhookId: "={{ $parameter.webhookId }}",
					},
				},
			},
		},
		{
			name: "Get Logs",
			value: "logs",
			action: "Get webhook delivery logs",
			routing: {
				request: {
					method: "GET",
					url: "/webhooks/logs",
					qs: {
						limit: "={{ $parameter.limit || 50 }}",
						status: "={{ $parameter.status || undefined }}",
						event: "={{ $parameter.event || undefined }}",
						webhookId: "={{ $parameter.webhookId || undefined }}",
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
					operation: ["update", "delete", "test", "logs"],
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
			description: "Webhook name (max 50 characters)",
			placeholder: "My Production Webhook",
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
			description: "Webhook endpoint URL (must be HTTPS in production)",
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
			],
			default: ["post.published", "post.failed"],
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["create", "update"],
				},
			},
			description: "Select which events should trigger webhook notifications",
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
			description: "Enable or disable webhook delivery",
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

		// Logs: Limit
		{
			displayName: "Limit",
			name: "limit",
			type: "number",
			default: 50,
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["logs"],
				},
			},
			description: "Maximum number of logs to return (max 100)",
		},

		// Logs: Status
		{
			displayName: "Status",
			name: "status",
			type: "options",
			options: [
				{
					name: "Success",
					value: "success",
				},
				{
					name: "Failed",
					value: "failed",
				},
			],
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["logs"],
				},
			},
			description: "Filter logs by delivery status",
		},

		// Logs: Event
		{
			displayName: "Event",
			name: "event",
			type: "options",
			options: [
				{
					name: "Post Scheduled",
					value: "post.scheduled",
				},
				{
					name: "Post Published",
					value: "post.published",
				},
				{
					name: "Post Failed",
					value: "post.failed",
				},
				{
					name: "Post Partial",
					value: "post.partial",
				},
				{
					name: "Post Recycled",
					value: "post.recycled",
				},
				{
					name: "Account Connected",
					value: "account.connected",
				},
				{
					name: "Account Disconnected",
					value: "account.disconnected",
				},
				{
					name: "Message Received",
					value: "message.received",
				},
				{
					name: "Comment Received",
					value: "comment.received",
				},
				{
					name: "Webhook Test",
					value: "webhook.test",
				},
			],
			default: "",
			displayOptions: {
				show: {
					resource: ["webhooks"],
					operation: ["logs"],
				},
			},
			description: "Filter logs by event type",
		},
	],
};