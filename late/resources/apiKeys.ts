import type { LateResourceModule } from "../types";

export const apiKeysResource: LateResourceModule = {
	operations: [
		{
			name: "List",
			value: "list",
			action: "List API keys",
			routing: {
				request: {
					method: "GET",
					url: "/v1/api-keys",
				},
			},
		},
		{
			name: "Create",
			value: "create",
			action: "Create API key",
			routing: {
				request: {
					method: "POST",
					url: "/v1/api-keys",
					body: {
						name: "={{ $parameter.name }}",
						expiresIn: "={{ $parameter.expiresIn || undefined }}",
						scope: "={{ $parameter.scope }}",
						profileIds: "={{ $parameter.scope === 'profiles' ? $parameter.profileIds : undefined }}",
						permission: "={{ $parameter.permission }}",
					},
				},
			},
		},
		{
			name: "Delete",
			value: "delete",
			action: "Delete API key",
			routing: {
				request: {
					method: "DELETE",
					url: "=/v1/api-keys/{{ $parameter.keyId }}",
				},
			},
		},
	],

	fields: [
		// Key ID for delete
		{
			displayName: "Key ID",
			name: "keyId",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["delete"],
				},
			},
			description: "The API key ID to delete. Get IDs from the 'List' operation.",
			required: true,
		},

		// Name for create
		{
			displayName: "Name",
			name: "name",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["create"],
				},
			},
			description: "A descriptive name for the API key (e.g., 'Production', 'n8n Integration')",
			placeholder: "My API Key",
			required: true,
		},

		// Expiry for create (days)
		{
			displayName: "Expires In (Days)",
			name: "expiresIn",
			type: "number",
			default: 0,
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["create"],
				},
			},
			description: "Optional. Number of days until the API key expires. Leave empty or set to 0 for no expiration.",
		},

		// Scope for create
		{
			displayName: "Scope",
			name: "scope",
			type: "options",
			default: "full",
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["create"],
				},
			},
			description:
				"Access scope for this key. 'Full' grants access to all profiles. 'Profiles' restricts access to specific profile IDs.",
			options: [
				{ name: "Full", value: "full" },
				{ name: "Profiles", value: "profiles" },
			],
		},

		// Profile IDs for create (required when scope is profiles)
		{
			displayName: "Profile IDs",
			name: "profileIds",
			type: "string",
			default: [],
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["create"],
					scope: ["profiles"],
				},
			},
			description: "List of profile IDs this key can access. Required when Scope is set to 'Profiles'.",
			placeholder: "6507a1b2c3d4e5f6a7b8c9d0",
			required: true,
			typeOptions: {
				multipleValues: true,
			},
		},

		// Permission for create
		{
			displayName: "Permission",
			name: "permission",
			type: "options",
			default: "read-write",
			displayOptions: {
				show: {
					resource: ["apiKeys"],
					operation: ["create"],
				},
			},
			description:
				"Permissions for this key. 'Read-Write' allows all operations. 'Read' restricts to GET requests only.",
			options: [
				{ name: "Read-Write", value: "read-write" },
				{ name: "Read", value: "read" },
			],
		},
	],
};