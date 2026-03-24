import type { LateResourceModule } from "../types";
import {
	buildProfileIdField,
	buildTempTokenField,
} from "../utils/commonFields";
import { SUPPORTED_PLATFORMS } from "../utils/platformHelpers";

export const connectResource: LateResourceModule = {
	operations: [
		{
			name: "Get Connect URL",
			value: "getConnectUrl",
			action: "Get OAuth connect URL",
			routing: {
				request: {
					method: "GET",
					url: "=/connect/{{ $parameter.platform }}",
					qs: {
						profileId: "={{ $parameter.profileId }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
						headless: "={{ $parameter.headless || undefined }}",
					},
				},
			},
		},
		{
			name: "Complete OAuth Callback",
			value: "handleOAuthCallback",
			action: "Complete OAuth callback",
			routing: {
				request: {
					method: "POST",
					url: "=/connect/{{ $parameter.platform }}",
					body: {
						code: "={{ $parameter.code }}",
						state: "={{ $parameter.state }}",
						profileId: "={{ $parameter.profileId }}",
					},
				},
			},
		},
		{
			name: "List Facebook Pages (Headless)",
			value: "listFacebookPages",
			action: "List Facebook pages",
			routing: {
				request: {
					method: "GET",
					url: "/connect/facebook/select-page",
					qs: {
						profileId: "={{ $parameter.profileId }}",
						tempToken: "={{ $parameter.tempToken }}",
					},
				},
			},
		},
		{
			name: "Select Facebook Page (Headless)",
			value: "selectFacebookPage",
			action: "Select Facebook page",
			routing: {
				request: {
					method: "POST",
					url: "/connect/facebook/select-page",
					body: {
						profileId: "={{ $parameter.profileId }}",
						pageId: "={{ $parameter.pageId }}",
						tempToken: "={{ $parameter.tempToken }}",
						userProfile: "={{ $parameter.userProfile || undefined }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
					},
				},
			},
		},
		{
			name: "List Google Business Locations (Headless)",
			value: "listGoogleBusinessLocations",
			action: "List GBP locations",
			routing: {
				request: {
					method: "GET",
					url: "/connect/googlebusiness/locations",
					qs: {
						profileId: "={{ $parameter.profileId }}",
						tempToken: "={{ $parameter.tempToken }}",
					},
				},
			},
		},
		{
			name: "Select Google Business Location (Headless)",
			value: "selectGoogleBusinessLocation",
			action: "Select GBP location",
			routing: {
				request: {
					method: "POST",
					url: "/connect/googlebusiness/select-location",
					body: {
						profileId: "={{ $parameter.profileId }}",
						locationId: "={{ $parameter.locationId }}",
						tempToken: "={{ $parameter.tempToken }}",
						userProfile: "={{ $parameter.userProfile }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
					},
				},
			},
		},
		{
			name: "Get Pending OAuth Data (Headless)",
			value: "getPendingOAuthData",
			action: "Get pending OAuth data",
			routing: {
				request: {
					method: "GET",
					url: "/connect/pending-data",
					qs: {
						token: "={{ $parameter.token }}",
					},
				},
			},
		},
		{
			name: "List LinkedIn Organizations (Details)",
			value: "listLinkedInOrganizations",
			action: "List LinkedIn orgs",
			routing: {
				request: {
					method: "GET",
					url: "/connect/linkedin/organizations",
					qs: {
						tempToken: "={{ $parameter.tempToken }}",
						orgIds: "={{ $parameter.orgIds }}",
					},
				},
			},
		},
		{
			name: "Select LinkedIn Organization",
			value: "selectLinkedInOrganization",
			action: "Select LinkedIn org",
			routing: {
				request: {
					method: "POST",
					url: "/connect/linkedin/select-organization",
					body: {
						profileId: "={{ $parameter.profileId }}",
						tempToken: "={{ $parameter.tempToken }}",
						userProfile: "={{ $parameter.userProfile }}",
						accountType: "={{ $parameter.accountType }}",
						selectedOrganization: "={{ $parameter.selectedOrganization || undefined }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
					},
				},
			},
		},
		{
			name: "List Pinterest Boards (Headless)",
			value: "listPinterestBoardsForSelection",
			action: "List Pinterest boards",
			routing: {
				request: {
					method: "GET",
					url: "/connect/pinterest/select-board",
					headers: {
						"X-Connect-Token": "={{ $parameter.xConnectToken || undefined }}",
					},
					qs: {
						profileId: "={{ $parameter.profileId }}",
						tempToken: "={{ $parameter.tempToken }}",
					},
				},
			},
		},
		{
			name: "Select Pinterest Board (Headless)",
			value: "selectPinterestBoard",
			action: "Select Pinterest board",
			routing: {
				request: {
					method: "POST",
					url: "/connect/pinterest/select-board",
					body: {
						profileId: "={{ $parameter.profileId }}",
						boardId: "={{ $parameter.boardId }}",
						boardName: "={{ $parameter.boardName || undefined }}",
						tempToken: "={{ $parameter.tempToken }}",
						userProfile: "={{ $parameter.userProfile || undefined }}",
						refreshToken: "={{ $parameter.refreshToken || undefined }}",
						expiresIn: "={{ $parameter.expiresIn || undefined }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
					},
				},
			},
		},
		{
			name: "List Snapchat Profiles (Headless)",
			value: "listSnapchatProfiles",
			action: "List Snapchat profiles",
			routing: {
				request: {
					method: "GET",
					url: "/connect/snapchat/select-profile",
					headers: {
						"X-Connect-Token": "={{ $parameter.xConnectToken || undefined }}",
					},
					qs: {
						profileId: "={{ $parameter.profileId }}",
						tempToken: "={{ $parameter.tempToken }}",
					},
				},
			},
		},
		{
			name: "Select Snapchat Profile (Headless)",
			value: "selectSnapchatProfile",
			action: "Select Snapchat profile",
			routing: {
				request: {
					method: "POST",
					url: "/connect/snapchat/select-profile",
					headers: {
						"X-Connect-Token": "={{ $parameter.xConnectToken || undefined }}",
					},
					body: {
						profileId: "={{ $parameter.profileId }}",
						selectedPublicProfile: "={{ $parameter.selectedPublicProfile }}",
						tempToken: "={{ $parameter.tempToken }}",
						userProfile: "={{ $parameter.userProfile }}",
						refreshToken: "={{ $parameter.refreshToken || undefined }}",
						expiresIn: "={{ $parameter.expiresIn || undefined }}",
						redirect_url: "={{ $parameter.redirectUrl || undefined }}",
					},
				},
			},
		},
		{
			name: "Connect Bluesky via Credentials",
			value: "connectBlueskyCredentials",
			action: "Connect Bluesky account",
			routing: {
				request: {
					method: "POST",
					url: "/connect/bluesky/credentials",
					body: {
						identifier: "={{ $parameter.identifier }}",
						appPassword: "={{ $parameter.appPassword }}",
						state: "={{ $parameter.state }}",
						redirectUri: "={{ $parameter.redirectUri || undefined }}",
					},
				},
			},
		},
		{
			name: "Connect WhatsApp via Credentials",
			value: "connectWhatsAppCredentials",
			action: "Connect WhatsApp via credentials",
			routing: {
				request: {
					method: "POST",
					url: "/connect/whatsapp/credentials",
					body: {
						profileId: "={{ $parameter.profileId }}",
						accessToken: "={{ $parameter.accessToken }}",
						wabaId: "={{ $parameter.wabaId }}",
						phoneNumberId: "={{ $parameter.phoneNumberId }}",
					},
				},
			},
		},
		{
			name: "Generate Telegram Code",
			value: "getTelegramConnectStatus",
			action: "Generate Telegram code",
			routing: {
				request: {
					method: "GET",
					url: "/connect/telegram",
					qs: {
						profileId: "={{ $parameter.profileId }}",
					},
				},
			},
		},
		{
			name: "Connect Telegram Directly",
			value: "initiateTelegramConnect",
			action: "Connect Telegram directly",
			routing: {
				request: {
					method: "POST",
					url: "/connect/telegram",
					body: {
						chatId: "={{ $parameter.chatId }}",
						profileId: "={{ $parameter.profileId }}",
					},
				},
			},
		},
		{
			name: "Check Telegram Status",
			value: "completeTelegramConnect",
			action: "Check Telegram status",
			routing: {
				request: {
					method: "PATCH",
					url: "/connect/telegram",
					qs: {
						code: "={{ $parameter.code }}",
					},
				},
			},
		},
	],

	fields: [
		{
			displayName: "Platform",
			name: "platform",
			type: "options",
			options: SUPPORTED_PLATFORMS.map((platform) => ({
				name: platform.name,
				value: platform.value,
				description: `Connect ${platform.name} account`,
			})),
			default: "twitter",
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["getConnectUrl", "handleOAuthCallback"],
				},
			},
			description:
				"Social media platform to connect to your profile. Each platform has specific requirements and OAuth flows.",
		},

		{
			...buildProfileIdField("connect", [
				"getConnectUrl",
				"handleOAuthCallback",
				"listFacebookPages",
				"selectFacebookPage",
				"listGoogleBusinessLocations",
				"selectGoogleBusinessLocation",
				"selectLinkedInOrganization",
				"listPinterestBoardsForSelection",
				"selectPinterestBoard",
				"listSnapchatProfiles",
				"selectSnapchatProfile",
				"connectWhatsAppCredentials",
				"getTelegramConnectStatus",
				"initiateTelegramConnect",
			]),
			description:
				"The profile ID where this social media account will be connected. Get profile IDs from 'Profiles > List'.",
			placeholder: "profile_123_abc",
		},

		{
			displayName: "Redirect URL",
			name: "redirectUrl",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: [
						"getConnectUrl",
						"selectFacebookPage",
						"selectGoogleBusinessLocation",
						"selectLinkedInOrganization",
						"selectPinterestBoard",
						"selectSnapchatProfile",
					],
				},
			},
			description:
				"Optional: Custom URL to redirect to after completion. Standard mode appends connection details. Headless mode appends OAuth data parameters for custom UI flows.",
			placeholder: "https://your-app.com/oauth-callback",
		},

		{
			displayName: "Headless",
			name: "headless",
			type: "boolean",
			default: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["getConnectUrl"],
				},
			},
			description:
				"When enabled, Zernio redirects to your redirect URL with raw OAuth data so you can build a custom connect/selection UI.",
		},

		{
			displayName: "Code",
			name: "code",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["handleOAuthCallback"],
				},
			},
			description: "OAuth authorization code returned by the platform.",
			placeholder: "AQAB...",
		},
		{
			displayName: "State",
			name: "state",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["handleOAuthCallback", "connectBlueskyCredentials"],
				},
			},
			description:
				"OAuth state string. For Bluesky credentials flow, must be formatted as {userId}-{profileId}.",
			placeholder: "6507a1b2c3d4e5f6a7b8c9d0-6507a1b2c3d4e5f6a7b8c9d1",
		},

		{
			...buildTempTokenField("connect", [
				"listFacebookPages",
				"selectFacebookPage",
				"listGoogleBusinessLocations",
				"selectGoogleBusinessLocation",
				"listLinkedInOrganizations",
				"selectLinkedInOrganization",
				"listPinterestBoardsForSelection",
				"selectPinterestBoard",
				"listSnapchatProfiles",
				"selectSnapchatProfile",
			]),
			description:
				"Temporary access token returned via the OAuth redirect in headless flows. Pass it to list/select endpoints to complete selection.",
			placeholder: "EAAxxxxx...",
		},

		{
			displayName: "Facebook Page ID",
			name: "pageId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectFacebookPage"],
				},
			},
			description: "The Facebook Page ID selected by the user.",
			placeholder: "123456789",
		},

		{
			displayName: "Location ID",
			name: "locationId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectGoogleBusinessLocation"],
				},
			},
			description: "The Google Business Profile location ID selected by the user.",
			placeholder: "9281089117903930794",
		},

		{
			displayName: "User Profile (JSON)",
			name: "userProfile",
			type: "json",
			default: {},
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: [
						"selectFacebookPage",
						"selectGoogleBusinessLocation",
						"selectLinkedInOrganization",
						"selectPinterestBoard",
						"selectSnapchatProfile",
					],
				},
			},
			description:
				"User profile object from the OAuth redirect. For Google Business selection, this should include refreshToken and should always be included.",
		},

		{
			displayName: "Pending Data Token",
			name: "token",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["getPendingOAuthData"],
				},
			},
			description:
				"One-time pending data token from the OAuth redirect URL (pendingDataToken). Expires after 10 minutes.",
			placeholder: "pdt_...",
		},

		{
			displayName: "Organization IDs",
			name: "orgIds",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["listLinkedInOrganizations"],
				},
			},
			description:
				"Comma-separated list of LinkedIn organization IDs to fetch details for (max 100).",
			placeholder: "12345678,87654321",
		},

		{
			displayName: "LinkedIn Account Type",
			name: "accountType",
			type: "options",
			options: [
				{
					name: "Personal",
					value: "personal",
					description: "Connect as a personal LinkedIn profile",
				},
				{
					name: "Organization",
					value: "organization",
					description: "Connect as an organization/company page",
				},
			],
			default: "personal",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectLinkedInOrganization"],
				},
			},
			description:
				"Choose whether to connect as a personal profile or as an organization (company page).",
		},

		{
			displayName: "Selected Organization (JSON)",
			name: "selectedOrganization",
			type: "json",
			default: {},
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectLinkedInOrganization"],
				},
			},
			description:
				"Only required when accountType is organization. Provide the selected organization object (e.g. { id, urn, name }).",
		},

		{
			displayName: "X-Connect-Token",
			name: "xConnectToken",
			type: "string",
			default: "",
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: [
						"listPinterestBoardsForSelection",
						"listSnapchatProfiles",
						"selectSnapchatProfile",
					],
				},
			},
			description:
				"Short-lived connect token from the OAuth redirect. Required for some headless selection list endpoints.",
			placeholder: "ct_...",
		},

		{
			displayName: "Pinterest Board ID",
			name: "boardId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectPinterestBoard"],
				},
			},
			description: "The Pinterest Board ID selected by the user.",
			placeholder: "123456789012345678",
		},
		{
			displayName: "Pinterest Board Name",
			name: "boardName",
			type: "string",
			default: "",
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectPinterestBoard"],
				},
			},
			description: "Optional: The board name (for display purposes).",
			placeholder: "Marketing Ideas",
		},

		{
			displayName: "Refresh Token",
			name: "refreshToken",
			type: "string",
			default: "",
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectPinterestBoard", "selectSnapchatProfile"],
				},
			},
			description: "Optional: Refresh token returned by the platform.",
			placeholder: "1//0gxxxxx...",
		},
		{
			displayName: "Expires In (Seconds)",
			name: "expiresIn",
			type: "number",
			default: 0,
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectPinterestBoard", "selectSnapchatProfile"],
				},
			},
			description: "Optional: Token expiration time in seconds.",
		},

		{
			displayName: "Selected Public Profile (JSON)",
			name: "selectedPublicProfile",
			type: "json",
			default: {},
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["selectSnapchatProfile"],
				},
			},
			description:
				"The selected Snapchat Public Profile object (must include id and display_name).",
		},

		{
			displayName: "Identifier",
			name: "identifier",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectBlueskyCredentials"],
				},
			},
			description: "Your Bluesky handle (e.g. user.bsky.social) or email address.",
			placeholder: "yourhandle.bsky.social",
		},
		{
			displayName: "App Password",
			name: "appPassword",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectBlueskyCredentials"],
				},
			},
			description: "App password generated from Bluesky Settings > App Passwords.",
			placeholder: "xxxx-xxxx-xxxx-xxxx",
		},
		{
			displayName: "Redirect URI",
			name: "redirectUri",
			type: "string",
			default: "",
			required: false,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectBlueskyCredentials"],
				},
			},
			description: "Optional URL to redirect to after successful connection.",
			placeholder: "https://yourapp.com/connected",
		},

		{
			displayName: "Access Token",
			name: "accessToken",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectWhatsAppCredentials"],
				},
			},
			description: "Permanent System User access token from Meta Business Suite.",
			placeholder: "EAABsbCS...your-system-user-token",
		},
		{
			displayName: "WABA ID",
			name: "wabaId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectWhatsAppCredentials"],
				},
			},
			description: "WhatsApp Business Account ID from Meta.",
			placeholder: "123456789012345",
		},
		{
			displayName: "Phone Number ID",
			name: "phoneNumberId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["connectWhatsAppCredentials"],
				},
			},
			description: "Phone Number ID from Meta WhatsApp Manager.",
			placeholder: "987654321098765",
		},

		{
			displayName: "Chat ID",
			name: "chatId",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["initiateTelegramConnect"],
				},
			},
			description:
				"The Telegram chat ID. Numeric ID (e.g. \"-1001234567890\") or username with @ prefix (e.g. \"@mychannel\").",
			placeholder: "-1001234567890",
		},
		{
			displayName: "Code",
			name: "code",
			type: "string",
			default: "",
			required: true,
			displayOptions: {
				show: {
					resource: ["connect"],
					operation: ["completeTelegramConnect"],
				},
			},
			description: "The access code to check status for.",
			placeholder: "ZRN-ABC123",
		},
	],
};