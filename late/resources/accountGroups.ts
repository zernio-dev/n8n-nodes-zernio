import type { LateResourceModule } from "../types";

export const accountGroupsResource: LateResourceModule = {
	operations: [
		{
			name: "List",
			value: "list",
			action: "List account groups",
			routing: {
				request: {
					method: "GET",
					url: "/account-groups",
				},
			},
		},
		{
			name: "Create",
			value: "create",
			action: "Create account group",
			routing: {
				request: {
					method: "POST",
					url: "/account-groups",
					body: {
						name: "={{ $parameter.name }}",
						accountIds:
							"={{ $parameter.accountIds.split(',').map(s => s.trim()).filter(s => s) }}",
					},
				},
			},
		},
		{
			name: "Update",
			value: "update",
			action: "Update account group",
			routing: {
				request: {
					method: "PUT",
					url: "=/account-groups/{{ $parameter.groupId }}",
					body: {
						name: "={{ $parameter.name || undefined }}",
						accountIds:
							"={{ $parameter.accountIds ? $parameter.accountIds.split(',').map(s => s.trim()).filter(s => s) : undefined }}",
					},
				},
			},
		},
		{
			name: "Delete",
			value: "delete",
			action: "Delete account group",
			routing: {
				request: {
					method: "DELETE",
					url: "=/account-groups/{{ $parameter.groupId }}",
				},
			},
		},
	],

	fields: [
		// Group ID for update/delete
		{
			displayName: "Group ID",
			name: "groupId",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["accountGroups"],
					operation: ["update", "delete"],
				},
			},
			description: "The account group ID. Get IDs from the 'List' operation.",
			required: true,
		},

		// Group name
		{
			displayName: "Name",
			name: "name",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["accountGroups"],
					operation: ["create", "update"],
				},
			},
			description: "Name for the account group",
			placeholder: "Marketing Accounts",
			required: true,
		},

		// Account IDs
		{
			displayName: "Account IDs",
			name: "accountIds",
			type: "string",
			default: "",
			displayOptions: {
				show: {
					resource: ["accountGroups"],
					operation: ["create", "update"],
				},
			},
			description:
				"Comma-separated list of social account IDs to include in this group. Get account IDs from the 'Accounts > List' operation.",
			placeholder: "64e1f0a9e2b5af0012ab34cd,64e1f0a9e2b5af0012ab34ce",
			required: true,
		},
	],
};