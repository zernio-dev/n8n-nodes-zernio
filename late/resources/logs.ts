import type { LateResourceModule } from "../types";
import { SUPPORTED_PLATFORMS } from "../utils/platformHelpers";

export const logsResource: LateResourceModule = {
	operations: [
		{
			name: "List Posts Logs",
			value: "listPostsLogs",
			action: "List publishing logs",
			routing: {
				request: {
					method: "GET",
					url: "/posts/logs",
					qs: {
						status: "={{ $parameter.status || undefined }}",
						platform: "={{ $parameter.platform || undefined }}",
						action: "={{ $parameter.action || undefined }}",
						days: "={{ $parameter.days || 7 }}",
						limit: "={{ $parameter.limit || 50 }}",
						skip: "={{ $parameter.skip || 0 }}",
						search: "={{ $parameter.search || undefined }}",
					},
				},
			},
		},
		{
			name: "List Connection Logs",
			value: "listConnectionLogs",
			action: "List connection logs",
			routing: {
				request: {
					method: "GET",
					url: "/connections/logs",
					qs: {
						platform: "={{ $parameter.platform || undefined }}",
						eventType: "={{ $parameter.eventType || undefined }}",
						status: "={{ $parameter.connectionStatus || undefined }}",
						days: "={{ $parameter.days || 7 }}",
						limit: "={{ $parameter.limit || 50 }}",
						skip: "={{ $parameter.skip || 0 }}",
					},
				},
			},
		},
		{
			name: "Get Post Logs",
			value: "getPostLogs",
			action: "Get post logs",
			routing: {
				request: {
					method: "GET",
					url: "=/posts/{{ $parameter.postId }}/logs",
					qs: {
						limit: "={{ $parameter.limit || 50 }}",
					},
				},
			},
		},
	],

	fields: [
		// Post ID for getPostLogs
		{
			displayName: "Post ID",
			name: "postId",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["getPostLogs"],
				},
			},
			description: "The post ID",
			placeholder: "64f0a1b2c3d4e5f6a7b8c9d0",
			required: true,
		},

		// Status filter (posts logs)
		{
			displayName: "Status",
			name: "status",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				{ name: "Success", value: "success" },
				{ name: "Failed", value: "failed" },
				{ name: "Pending", value: "pending" },
				{ name: "Skipped", value: "skipped" },
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs"],
				},
			},
			description: "Filter by log status",
		},

		// Platform filter (posts logs + connection logs)
		{
			displayName: "Platform",
			name: "platform",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				...SUPPORTED_PLATFORMS.map((p) => ({
					name: p.name,
					value: p.value,
				})),
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs", "listConnectionLogs"],
				},
			},
			description: "Filter by platform",
		},

		// Action filter (posts logs)
		{
			displayName: "Action",
			name: "action",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				{ name: "Publish", value: "publish" },
				{ name: "Retry", value: "retry" },
				{ name: "Media Upload", value: "media_upload" },
				{ name: "Rate Limit Pause", value: "rate_limit_pause" },
				{ name: "Token Refresh", value: "token_refresh" },
				{ name: "Cancelled", value: "cancelled" },
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs"],
				},
			},
			description: "Filter by action type",
		},

		// Days filter (posts logs + connection logs)
		{
			displayName: "Days",
			name: "days",
			type: "number",
			default: 7,
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs", "listConnectionLogs"],
				},
			},
			description: "Number of days to look back (max 7)",
		},

		// Search filter (posts logs)
		{
			displayName: "Search",
			name: "search",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs"],
				},
			},
			description: "Search through log entries by text content",
			placeholder: "rate limit",
		},

		// Pagination (posts logs + connection logs)
		{
			displayName: "Skip",
			name: "skip",
			type: "number",
			default: 0,
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs", "listConnectionLogs"],
				},
			},
			description: "Number of logs to skip (for pagination)",
		},
		{
			displayName: "Limit",
			name: "limit",
			type: "number",
			default: 50,
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listPostsLogs", "listConnectionLogs", "getPostLogs"],
				},
			},
			description: "Maximum number of logs to return (max 100)",
		},

		// Connection logs filters
		{
			displayName: "Event Type",
			name: "eventType",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				{ name: "Connect Success", value: "connect_success" },
				{ name: "Connect Failed", value: "connect_failed" },
				{ name: "Disconnect", value: "disconnect" },
				{ name: "Reconnect Success", value: "reconnect_success" },
				{ name: "Reconnect Failed", value: "reconnect_failed" },
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listConnectionLogs"],
				},
			},
			description: "Filter by event type",
		},
		{
			displayName: "Status",
			name: "connectionStatus",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				{ name: "Success", value: "success" },
				{ name: "Failed", value: "failed" },
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["logs"],
					operation: ["listConnectionLogs"],
				},
			},
			description:
				"Filter by status (shorthand for event types). success = connect_success + reconnect_success, failed = connect_failed + reconnect_failed",
		},
	],
};