import type { LateResourceModule } from "../types";
import { SUPPORTED_PLATFORMS } from "../utils/platformHelpers";
import { buildAccountIdField, buildProfileIdField } from "../utils/commonFields";

export const analyticsResource: LateResourceModule = {
	operations: [
		{
			name: "Get Analytics",
			value: "get",
			action: "Get post analytics",
			routing: {
				request: {
					method: "GET",
					url: "/analytics",
					qs: {
						postId: "={{ $parameter.postId || undefined }}",
						platform: "={{ $parameter.platform || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						accountId: "={{ $parameter.accountId || undefined }}",
						source: "={{ $parameter.source || undefined }}",
						fromDate: "={{ $parameter.fromDate || undefined }}",
						toDate: "={{ $parameter.toDate || undefined }}",
						limit: "={{ $parameter.limit || undefined }}",
						page: "={{ $parameter.page || undefined }}",
						sortBy: "={{ $parameter.sortBy || undefined }}",
						order: "={{ $parameter.order || undefined }}",
					},
				},
			},
		},
		{
			name: "YouTube Daily Views",
			value: "youtubeDailyViews",
			action: "Get YouTube daily views",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/youtube/daily-views",
					qs: {
						videoId: "={{ $parameter.videoId }}",
						accountId: "={{ $parameter.accountId }}",
						startDate: "={{ $parameter.startDate || undefined }}",
						endDate: "={{ $parameter.endDate || undefined }}",
					},
				},
			},
		},
		{
			name: "Instagram Account Insights",
			value: "instagramAccountInsights",
			action: "Get Instagram account-level insights",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/instagram/account-insights",
					qs: {
						accountId: "={{ $parameter.accountId }}",
						metrics: "={{ $parameter.metrics || undefined }}",
						since: "={{ $parameter.since || undefined }}",
						until: "={{ $parameter.until || undefined }}",
						metricType: "={{ $parameter.metricType || undefined }}",
						breakdown: "={{ $parameter.breakdown || undefined }}",
					},
				},
			},
		},
		{
			name: "Instagram Demographics",
			value: "instagramDemographics",
			action: "Get Instagram audience demographics",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/instagram/demographics",
					qs: {
						accountId: "={{ $parameter.accountId }}",
						metric: "={{ $parameter.metric || undefined }}",
						breakdown: "={{ $parameter.breakdown || undefined }}",
						timeframe: "={{ $parameter.timeframe || undefined }}",
					},
				},
			},
		},
		{
			name: "Daily Metrics",
			value: "dailyMetrics",
			action: "Get daily aggregated metrics",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/daily-metrics",
					qs: {
						platform: "={{ $parameter.platform || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						accountId: "={{ $parameter.accountId || undefined }}",
						fromDate: "={{ $parameter.fromDateTime || undefined }}",
						toDate: "={{ $parameter.toDateTime || undefined }}",
						source: "={{ $parameter.source || undefined }}",
					},
				},
			},
		},
		{
			name: "Best Time to Post",
			value: "bestTime",
			action: "Get best times to post",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/best-time",
					qs: {
						platform: "={{ $parameter.platform || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						source: "={{ $parameter.source || undefined }}",
					},
				},
			},
		},
		{
			name: "Content Decay",
			value: "contentDecay",
			action: "Get content performance decay",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/content-decay",
					qs: {
						platform: "={{ $parameter.platform || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						source: "={{ $parameter.source || undefined }}",
					},
				},
			},
		},
		{
			name: "Posting Frequency",
			value: "postingFrequency",
			action: "Get posting frequency vs engagement",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/posting-frequency",
					qs: {
						platform: "={{ $parameter.platform || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						source: "={{ $parameter.source || undefined }}",
					},
				},
			},
		},
		{
			name: "Post Timeline",
			value: "postTimeline",
			action: "Get post analytics timeline",
			routing: {
				request: {
					method: "GET",
					url: "/analytics/post-timeline",
					qs: {
						postId: "={{ $parameter.postId }}",
						fromDate: "={{ $parameter.fromDateTime || undefined }}",
						toDate: "={{ $parameter.toDateTime || undefined }}",
					},
				},
			},
		},
		{
			name: "Follower Stats",
			value: "followerStats",
			action: "Get follower stats",
			routing: {
				request: {
					method: "GET",
					url: "/accounts/follower-stats",
					qs: {
						accountIds: "={{ $parameter.accountIds || undefined }}",
						profileId: "={{ $parameter.profileId || undefined }}",
						fromDate: "={{ $parameter.fromDate || undefined }}",
						toDate: "={{ $parameter.toDate || undefined }}",
						granularity: "={{ $parameter.granularity || undefined }}",
					},
				},
			},
		},
		{
			name: "LinkedIn Aggregate Analytics",
			value: "linkedinAggregateAnalytics",
			action: "Get LinkedIn aggregate stats",
			routing: {
				request: {
					method: "GET",
					url: "=/accounts/{{ $parameter.accountIdPath }}/linkedin-aggregate-analytics",
					qs: {
						aggregation: "={{ $parameter.aggregation || undefined }}",
						startDate: "={{ $parameter.startDate || undefined }}",
						endDate: "={{ $parameter.endDate || undefined }}",
						metrics: "={{ $parameter.metrics || undefined }}",
					},
				},
			},
		},
		{
			name: "LinkedIn Post Analytics",
			value: "linkedinPostAnalytics",
			action: "Get LinkedIn post stats",
			routing: {
				request: {
					method: "GET",
					url: "=/accounts/{{ $parameter.accountIdPath }}/linkedin-post-analytics",
					qs: {
						urn: "={{ $parameter.urn }}",
					},
				},
			},
		},
		{
			name: "LinkedIn Post Reactions",
			value: "linkedinPostReactions",
			action: "Get LinkedIn post reactions",
			routing: {
				request: {
					method: "GET",
					url: "=/accounts/{{ $parameter.accountIdPath }}/linkedin-post-reactions",
					qs: {
						urn: "={{ $parameter.urn }}",
						limit: "={{ $parameter.limit || undefined }}",
						cursor: "={{ $parameter.cursor || undefined }}",
					},
				},
			},
		},
	],

	fields: [
		// --- Get Analytics (post analytics) ---
		{
			displayName: "Post ID",
			name: "postId",
			type: "string",
			default: "",
			placeholder: "post_123 or 1234567890 or external_post_123",
			description:
				"Return analytics for a single post. Accepts both Zernio Post IDs and External Post IDs (auto-resolved). Leave empty to return a paginated list.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},

		// Platform filter (shared)
		{
			displayName: "Platform",
			name: "platform",
			type: "options",
			options: [
				{ name: "All Platforms", value: "" },
				...SUPPORTED_PLATFORMS.map((p) => ({
					name: p.name,
					value: p.value,
				})),
			],
			default: "",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: [
						"get",
						"dailyMetrics",
						"bestTime",
						"contentDecay",
						"postingFrequency",
					],
				},
			},
			description: "Filter by platform. Leave empty for all platforms.",
		},

		// Profile ID filter (shared)
		buildProfileIdField("analytics", ["get", "dailyMetrics", "bestTime", "contentDecay", "postingFrequency", "followerStats"], false),

		// Account ID filter (shared)
		{
			...buildAccountIdField(
				"analytics",
				[
					"get",
					"youtubeDailyViews",
					"instagramAccountInsights",
					"instagramDemographics",
					"dailyMetrics",
				],
				"Account ID",
				"Filter by a specific social account ID"
			),
			required: false,
		},

		{
			displayName: "Source",
			name: "source",
			type: "options",
			options: [
				{ name: "All", value: "all" },
				{ name: "Late (Posted via Zernio)", value: "late" },
				{ name: "External (Synced from Platform)", value: "external" },
			],
			default: "all",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get", "dailyMetrics", "bestTime", "contentDecay", "postingFrequency"],
				},
			},
			description: "Filter by post source/origin.",
		},

		{
			displayName: "From Date",
			name: "fromDate",
			type: "string",
			default: "",
			placeholder: "2024-01-01",
			description:
				"Inclusive lower bound (YYYY-MM-DD). Defaults to 90 days ago if omitted. Max range is 366 days.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},
		{
			displayName: "To Date",
			name: "toDate",
			type: "string",
			default: "",
			placeholder: "2024-01-31",
			description: "Inclusive upper bound (YYYY-MM-DD). Defaults to today if omitted.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},

		{
			displayName: "Limit",
			name: "limit",
			type: "number",
			default: 50,
			description: "Page size (1-100).",
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},
		{
			displayName: "Page",
			name: "page",
			type: "number",
			default: 1,
			description: "Page number (starting at 1).",
			typeOptions: {
				minValue: 1,
			},
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},
		{
			displayName: "Sort By",
			name: "sortBy",
			type: "options",
			options: [
				{ name: "Date", value: "date" },
				{ name: "Engagement", value: "engagement" },
				{ name: "Impressions", value: "impressions" },
				{ name: "Reach", value: "reach" },
				{ name: "Likes", value: "likes" },
				{ name: "Comments", value: "comments" },
				{ name: "Shares", value: "shares" },
				{ name: "Saves", value: "saves" },
				{ name: "Clicks", value: "clicks" },
				{ name: "Views", value: "views" },
			],
			default: "date",
			description: "Sort by date, engagement, or a specific metric.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},
		{
			displayName: "Order",
			name: "order",
			type: "options",
			options: [
				{ name: "Descending", value: "desc" },
				{ name: "Ascending", value: "asc" },
			],
			default: "desc",
			description: "Sort order.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["get"],
				},
			},
		},

		// --- YouTube Daily Views ---
		{
			displayName: "Video ID",
			name: "videoId",
			type: "string",
			default: "",
			required: true,
			placeholder: "dQw4w9WgXcQ",
			description: "The YouTube video ID.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["youtubeDailyViews"],
				},
			},
		},
		{
			displayName: "Start Date",
			name: "startDate",
			type: "string",
			default: "",
			placeholder: "2024-01-01",
			description: "Start date (YYYY-MM-DD). Defaults to 30 days ago.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["youtubeDailyViews", "linkedinAggregateAnalytics"],
				},
			},
		},
		{
			displayName: "End Date",
			name: "endDate",
			type: "string",
			default: "",
			placeholder: "2024-01-31",
			description:
				"End date (YYYY-MM-DD). For YouTube daily views, defaults to 3 days ago due to YouTube data latency.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["youtubeDailyViews", "linkedinAggregateAnalytics"],
				},
			},
		},

		// --- Instagram Account Insights ---
		{
			displayName: "Metrics",
			name: "metrics",
			type: "string",
			default: "",
			placeholder: "reach,views,accounts_engaged,total_interactions",
			description:
				"Comma-separated list of metrics. Leave empty for the default set: reach,views,accounts_engaged,total_interactions.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramAccountInsights"],
				},
			},
		},
		{
			displayName: "Since",
			name: "since",
			type: "string",
			default: "",
			placeholder: "2024-01-01",
			description: "Start date (YYYY-MM-DD). Defaults to 30 days ago.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramAccountInsights"],
				},
			},
		},
		{
			displayName: "Until",
			name: "until",
			type: "string",
			default: "",
			placeholder: "2024-01-31",
			description: "End date (YYYY-MM-DD). Defaults to today.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramAccountInsights"],
				},
			},
		},
		{
			displayName: "Metric Type",
			name: "metricType",
			type: "options",
			options: [
				{ name: "Total Value", value: "total_value" },
				{ name: "Time Series", value: "time_series" },
			],
			default: "total_value",
			description:
				'"total_value" returns aggregated totals (supports breakdowns). "time_series" returns daily values but only works with the "reach" metric.',
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramAccountInsights"],
				},
			},
		},
		{
			displayName: "Breakdown",
			name: "breakdown",
			type: "string",
			default: "",
			placeholder: "media_product_type",
			description:
				"Breakdown dimension (only valid with metricType=total_value). Valid values depend on the metric (e.g. media_product_type, follow_type, follower_type, contact_button_type).",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramAccountInsights"],
				},
			},
		},

		// --- Instagram Demographics ---
		{
			displayName: "Metric",
			name: "metric",
			type: "options",
			options: [
				{ name: "Follower Demographics", value: "follower_demographics" },
				{ name: "Engaged Audience Demographics", value: "engaged_audience_demographics" },
			],
			default: "follower_demographics",
			description: "Choose follower audience data or engaged viewers.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramDemographics"],
				},
			},
		},
		{
			displayName: "Breakdown",
			name: "breakdown",
			type: "string",
			default: "",
			placeholder: "age,city,country,gender",
			description:
				"Comma-separated list of demographic dimensions: age, city, country, gender. Leave empty for all four.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramDemographics"],
				},
			},
		},
		{
			displayName: "Timeframe",
			name: "timeframe",
			type: "options",
			options: [
				{ name: "This Month", value: "this_month" },
				{ name: "This Week", value: "this_week" },
			],
			default: "this_month",
			description: "Time period for demographic data.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["instagramDemographics"],
				},
			},
		},

		// --- Daily Metrics ---
		{
			displayName: "From Date",
			name: "fromDateTime",
			type: "dateTime",
			default: "",
			description: "Inclusive start date (ISO 8601). Defaults to 180 days ago.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["dailyMetrics", "postTimeline"],
				},
			},
		},
		{
			displayName: "To Date",
			name: "toDateTime",
			type: "dateTime",
			default: "",
			description: "Inclusive end date (ISO 8601). Defaults to now.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["dailyMetrics", "postTimeline"],
				},
			},
		},

		// --- Post Timeline ---
		{
			displayName: "Post ID",
			name: "postId",
			type: "string",
			default: "",
			required: true,
			placeholder: "post_123 or urn/platform post id",
			description:
				"The post to fetch timeline for. Accepts an ExternalPost ID, a platformPostId, or a Zernio Post ID.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["postTimeline"],
				},
			},
		},

		// --- Follower Stats ---
		{
			displayName: "Account IDs",
			name: "accountIds",
			type: "string",
			default: "",
			placeholder: "acc_123,acc_456",
			description:
				"Comma-separated list of account IDs. Leave empty to include all connected accounts.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["followerStats"],
				},
			},
		},
		{
			displayName: "From Date",
			name: "fromDate",
			type: "string",
			default: "",
			placeholder: "2024-01-01",
			description: "Start date (YYYY-MM-DD). Defaults to 30 days ago.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["followerStats"],
				},
			},
		},
		{
			displayName: "To Date",
			name: "toDate",
			type: "string",
			default: "",
			placeholder: "2024-01-31",
			description: "End date (YYYY-MM-DD). Defaults to today.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["followerStats"],
				},
			},
		},
		{
			displayName: "Granularity",
			name: "granularity",
			type: "options",
			options: [
				{ name: "Daily", value: "daily" },
				{ name: "Weekly", value: "weekly" },
				{ name: "Monthly", value: "monthly" },
			],
			default: "daily",
			description: "Data aggregation level.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["followerStats"],
				},
			},
		},

		// --- LinkedIn (path accountId) ---
		{
			displayName: "Account ID",
			name: "accountIdPath",
			type: "string",
			default: "",
			required: true,
			description: "The LinkedIn account ID (path parameter).",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: [
						"linkedinAggregateAnalytics",
						"linkedinPostAnalytics",
						"linkedinPostReactions",
					],
				},
			},
		},
		{
			displayName: "Aggregation",
			name: "aggregation",
			type: "options",
			options: [
				{ name: "Total (Lifetime Totals)", value: "TOTAL" },
				{ name: "Daily (Time Series)", value: "DAILY" },
			],
			default: "TOTAL",
			description:
				'TOTAL (default, lifetime totals) or DAILY (time series). MEMBERS_REACHED not available with DAILY.',
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["linkedinAggregateAnalytics"],
				},
			},
		},
		{
			displayName: "Metrics",
			name: "metrics",
			type: "string",
			default: "",
			placeholder: "IMPRESSION,REACTION,COMMENT",
			description:
				"Comma-separated metrics: IMPRESSION, MEMBERS_REACHED, REACTION, COMMENT, RESHARE. Leave empty for all.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["linkedinAggregateAnalytics"],
				},
			},
		},
		{
			displayName: "URN",
			name: "urn",
			type: "string",
			default: "",
			required: true,
			placeholder: "urn:li:share:7123456789012345678",
			description: "The LinkedIn post URN.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["linkedinPostAnalytics", "linkedinPostReactions"],
				},
			},
		},
		{
			displayName: "Limit",
			name: "limit",
			type: "number",
			default: 25,
			description: "Maximum number of reactions to return per page (1-100).",
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["linkedinPostReactions"],
				},
			},
		},
		{
			displayName: "Cursor",
			name: "cursor",
			type: "string",
			default: "",
			description: "Offset-based pagination start index.",
			displayOptions: {
				show: {
					resource: ["analytics"],
					operation: ["linkedinPostReactions"],
				},
			},
		},
	],
};