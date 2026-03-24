import type { LateResourceModule } from "../types";

export const usageResource: LateResourceModule = {
	operations: [
		{
			name: "Get Stats",
			value: "getStats",
			action: "Get usage statistics",
			routing: {
				request: {
					method: "GET",
					url: "/v1/usage-stats",
				},
			},
		},
		{
			name: "Get Usage Stats",
			value: "getUsageStats",
			action: "Get plan and usage stats",
			routing: {
				request: {
					method: "GET",
					url: "/v1/usage-stats",
				},
			},
		},
	],

	fields: [],
};