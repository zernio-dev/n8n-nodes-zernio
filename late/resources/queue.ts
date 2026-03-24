import type { LateResourceModule } from "../types";
import { buildProfileIdField } from "../utils/commonFields";

export const queueResource: LateResourceModule = {
  operations: [
    {
      name: "List Slots",
      value: "list",
      action: "List queue slots",
      routing: {
        request: {
          method: "GET",
          url: "/v1/queue/slots",
          qs: {
            profileId: "={{ $parameter.profileId }}",
            queueId: "={{ $parameter.queueId || undefined }}",
            all: "={{ $parameter.all ? 'true' : undefined }}",
          },
        },
      },
    },
    {
      name: "Create Slot",
      value: "create",
      action: "Create queue slot",
      routing: {
        request: {
          method: "POST",
          url: "/v1/queue/slots",
          body: {
            profileId: "={{ $parameter.profileId }}",
            name: "={{ $parameter.name }}",
            timezone: "={{ $parameter.timezone }}",
            slots: "={{ $parameter.slots }}",
            active: "={{ $parameter.active }}",
          },
        },
      },
    },
    {
      name: "Update Slot",
      value: "update",
      action: "Update queue slot",
      routing: {
        request: {
          method: "PUT",
          url: "/v1/queue/slots",
          body: {
            profileId: "={{ $parameter.profileId }}",
            queueId: "={{ $parameter.queueId || undefined }}",
            name: "={{ $parameter.name || undefined }}",
            timezone: "={{ $parameter.timezone }}",
            slots: "={{ $parameter.slots }}",
            active: "={{ $parameter.active }}",
            setAsDefault: "={{ $parameter.setAsDefault }}",
            reshuffleExisting: "={{ $parameter.reshuffleExisting }}",
          },
        },
      },
    },
    {
      name: "Delete Slot",
      value: "delete",
      action: "Delete queue slot",
      routing: {
        request: {
          method: "DELETE",
          url: "/v1/queue/slots",
          qs: {
            profileId: "={{ $parameter.profileId }}",
            queueId: "={{ $parameter.queueId }}",
          },
        },
      },
    },
    {
      name: "Preview Queue",
      value: "preview",
      action: "Preview upcoming queue posts",
      routing: {
        request: {
          method: "GET",
          url: "/v1/queue/preview",
          qs: {
            profileId: "={{ $parameter.profileId }}",
            queueId: "={{ $parameter.queueId || undefined }}",
            count: "={{ $parameter.count || 20 }}",
          },
        },
      },
    },
    {
      name: "Get Next Slot",
      value: "nextSlot",
      action: "Get next available queue slot",
      routing: {
        request: {
          method: "GET",
          url: "/v1/queue/next-slot",
          qs: {
            profileId: "={{ $parameter.profileId }}",
            queueId: "={{ $parameter.queueId || undefined }}",
          },
        },
      },
    },
  ],

  fields: [
    {
      ...buildProfileIdField("queue", ["list", "create", "update", "delete", "preview", "nextSlot"], true),
      description: "Profile ID to manage queues for",
    },

    {
      displayName: "Queue ID",
      name: "queueId",
      type: "string",
      default: "",
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["list", "update", "delete", "preview", "nextSlot"],
        },
      },
      description:
        "Specific queue ID. If omitted, the default queue will be used where applicable.",
      placeholder: "64f0a1b2c3d4e5f6a7b8c9d1",
      required: false,
    },

    {
      displayName: "All",
      name: "all",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["list"],
        },
      },
      description: "If enabled, lists all queues for the profile",
    },

    {
      displayName: "Name",
      name: "name",
      type: "string",
      default: "",
      required: true,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["create"],
        },
      },
      description: "Queue name (for example, 'Evening Posts')",
      placeholder: "Evening Posts",
    },

    {
      displayName: "Name",
      name: "name",
      type: "string",
      default: "",
      required: false,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["update"],
        },
      },
      description: "Queue name",
      placeholder: "Morning Posts",
    },

    {
      displayName: "Timezone",
      name: "timezone",
      type: "string",
      default: "UTC",
      required: true,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["create", "update"],
        },
      },
      description: "IANA timezone (for example, 'America/New_York')",
      placeholder: "America/New_York",
    },

    {
      displayName: "Slots",
      name: "slots",
      type: "fixedCollection",
      default: {},
      required: true,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["create", "update"],
        },
      },
      description:
        "Queue slots (day of week and time). Day of week: 0=Sunday ... 6=Saturday. Time: HH:MM (24-hour).",
      typeOptions: {
        multipleValues: true,
      },
      options: [
        {
          name: "slot",
          displayName: "Slot",
          values: [
            {
              displayName: "Day of Week",
              name: "dayOfWeek",
              type: "options",
              options: [
                { name: "Sunday", value: 0 },
                { name: "Monday", value: 1 },
                { name: "Tuesday", value: 2 },
                { name: "Wednesday", value: 3 },
                { name: "Thursday", value: 4 },
                { name: "Friday", value: 5 },
                { name: "Saturday", value: 6 },
              ],
              default: 1,
              required: true,
              description: "Day of the week for this queue slot",
            },
            {
              displayName: "Time",
              name: "time",
              type: "string",
              default: "09:00",
              required: true,
              description: "Time for this queue slot in HH:MM format (24-hour)",
              placeholder: "18:00",
            },
          ],
        },
      ],
    },

    {
      displayName: "Active",
      name: "active",
      type: "boolean",
      default: true,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["create", "update"],
        },
      },
      description: "Whether this queue is active",
    },

    {
      displayName: "Set As Default",
      name: "setAsDefault",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["update"],
        },
      },
      description: "If enabled, makes this queue the default for the profile",
    },

    {
      displayName: "Reshuffle Existing",
      name: "reshuffleExisting",
      type: "boolean",
      default: false,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["update"],
        },
      },
      description:
        "Whether to reschedule existing queued posts to match the new slots",
    },

    {
      displayName: "Count",
      name: "count",
      type: "number",
      default: 20,
      displayOptions: {
        show: {
          resource: ["queue"],
          operation: ["preview"],
        },
      },
      description: "Number of upcoming slot times to return (1-100)",
    },
  ],
};