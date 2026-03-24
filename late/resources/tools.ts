import type { INodeProperties } from "n8n-workflow";
import type { LateResourceModule } from "../types";

export const toolsResource: LateResourceModule = {
	operations: [
		{
			name: "YouTube: Download",
			value: "youtubeDownload",
			action: "Download YouTube video",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/youtube/download",
					qs: {
						url: "={{ $parameter.url }}",
						action: "={{ $parameter.action }}",
						format: "={{ $parameter.format }}",
						quality: "={{ $parameter.quality }}",
						formatId: "={{ $parameter.formatId }}",
					},
				},
			},
		},
		{
			name: "YouTube: Transcript",
			value: "youtubeTranscript",
			action: "Get YouTube transcript",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/youtube/transcript",
					qs: {
						url: "={{ $parameter.url }}",
						lang: "={{ $parameter.lang }}",
					},
				},
			},
		},
		{
			name: "Instagram: Download",
			value: "instagramDownload",
			action: "Download Instagram media",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/instagram/download",
					qs: {
						url: "={{ $parameter.url }}",
					},
				},
			},
		},
		{
			name: "Instagram: Hashtag Checker",
			value: "instagramHashtagChecker",
			action: "Check IG hashtag bans",
			routing: {
				request: {
					method: "POST",
					url: "/v1/tools/instagram/hashtag-checker",
					body: {
						hashtags: "={{ $parameter.hashtags }}",
					},
				},
			},
		},
		{
			name: "TikTok: Download",
			value: "tiktokDownload",
			action: "Download TikTok video",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/tiktok/download",
					qs: {
						url: "={{ $parameter.url }}",
						action: "={{ $parameter.action }}",
						formatId: "={{ $parameter.formatId }}",
					},
				},
			},
		},
		{
			name: "Twitter/X: Download",
			value: "twitterDownload",
			action: "Download Twitter/X media",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/twitter/download",
					qs: {
						url: "={{ $parameter.url }}",
						action: "={{ $parameter.action }}",
						formatId: "={{ $parameter.formatId }}",
					},
				},
			},
		},
		{
			name: "Facebook: Download",
			value: "facebookDownload",
			action: "Download Facebook video",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/facebook/download",
					qs: {
						url: "={{ $parameter.url }}",
					},
				},
			},
		},
		{
			name: "LinkedIn: Download",
			value: "linkedinDownload",
			action: "Download LinkedIn video",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/linkedin/download",
					qs: {
						url: "={{ $parameter.url }}",
					},
				},
			},
		},
		{
			name: "Bluesky: Download",
			value: "blueskyDownload",
			action: "Download Bluesky media",
			routing: {
				request: {
					method: "GET",
					url: "/v1/tools/bluesky/download",
					qs: {
						url: "={{ $parameter.url }}",
					},
				},
			},
		},
	],
	fields: [
		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			description: "YouTube video URL or video ID",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeDownload"],
				},
			},
		},
		{
			displayName: "Action",
			name: "action",
			type: "options",
			default: "download",
			description: "Action to perform: download returns a download URL; formats lists available formats",
			options: [
				{ name: "Download", value: "download" },
				{ name: "Formats", value: "formats" },
			],
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeDownload"],
				},
			},
		},
		{
			displayName: "Format",
			name: "format",
			type: "options",
			default: "video",
			description: "Desired format (used when Action is Download)",
			options: [
				{ name: "Video", value: "video" },
				{ name: "Audio", value: "audio" },
			],
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeDownload"],
					action: ["download"],
				},
			},
		},
		{
			displayName: "Quality",
			name: "quality",
			type: "options",
			default: "hd",
			description: "Desired quality (used when Action is Download)",
			options: [
				{ name: "HD", value: "hd" },
				{ name: "SD", value: "sd" },
			],
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeDownload"],
					action: ["download"],
				},
			},
		},
		{
			displayName: "Format ID",
			name: "formatId",
			type: "string",
			default: "",
			placeholder: "137",
			description: "Specific format ID from the formats list (optional)",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeDownload"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			description: "YouTube video URL or video ID",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeTranscript"],
				},
			},
		},
		{
			displayName: "Language",
			name: "lang",
			type: "string",
			default: "en",
			placeholder: "en",
			description: "Language code for transcript (for example: en, es, fr)",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["youtubeTranscript"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.instagram.com/reel/ABC123/",
			description: "Instagram reel or post URL",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["instagramDownload"],
				},
			},
		},

		{
			displayName: "Hashtags",
			name: "hashtags",
			type: "json",
			default: '["travel","followforfollow","fitness"]',
			required: true,
			description:
				"Array of hashtags to check (max 20). Provide as JSON array of strings, e.g. [\"travel\",\"fitness\"]",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["instagramHashtagChecker"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.tiktok.com/@user/video/123456789",
			description: "TikTok video URL or ID",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["tiktokDownload"],
				},
			},
		},
		{
			displayName: "Action",
			name: "action",
			type: "options",
			default: "download",
			description: "Choose whether to download or list available formats",
			options: [
				{ name: "Download", value: "download" },
				{ name: "Formats", value: "formats" },
			],
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["tiktokDownload"],
				},
			},
		},
		{
			displayName: "Format ID",
			name: "formatId",
			type: "string",
			default: "",
			placeholder: "0",
			description: "Specific format ID (for example: 0 = no watermark, depending on formats list)",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["tiktokDownload"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://x.com/user/status/123456789",
			description: "Twitter/X post URL",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["twitterDownload"],
				},
			},
		},
		{
			displayName: "Action",
			name: "action",
			type: "options",
			default: "download",
			description: "Choose whether to download or list available formats",
			options: [
				{ name: "Download", value: "download" },
				{ name: "Formats", value: "formats" },
			],
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["twitterDownload"],
				},
			},
		},
		{
			displayName: "Format ID",
			name: "formatId",
			type: "string",
			default: "",
			placeholder: "1",
			description: "Specific format ID from the formats list (optional)",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["twitterDownload"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.facebook.com/reel/123456789",
			description: "Facebook video or reel URL",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["facebookDownload"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://www.linkedin.com/posts/user_activity-123456789",
			description: "LinkedIn post URL",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["linkedinDownload"],
				},
			},
		},

		{
			displayName: "URL",
			name: "url",
			type: "string",
			default: "",
			required: true,
			placeholder: "https://bsky.app/profile/user.bsky.social/post/abc123",
			description: "Bluesky post URL",
			displayOptions: {
				show: {
					resource: ["tools"],
					operation: ["blueskyDownload"],
				},
			},
		},
	] as INodeProperties[],
};