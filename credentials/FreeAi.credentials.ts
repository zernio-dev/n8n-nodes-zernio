import type { ICredentialType, INodeProperties } from "n8n-workflow";

/**
 * API key opsional - dibutuhkan oleh provider ber-key (OpenRouter, TipRouter,
 * ArzaStore, CleanAPIs, Netraux, Jeroker). Provider anonim (ovh, llm7, kilo)
 * berjalan tanpa key.
 *
 * Node ini lebih dulu membaca kunci per-provider dari environment sesuai
 * providers.json (mis. OPENROUTER_API_KEY, TIP_API_KEY, NETRAUX_API_KEY), lalu
 * baru memakai nilai di field ini sebagai cadangan. Urutan itu penting karena
 * tiap provider butuh kunci berbeda sedangkan kredensial n8n hanya punya satu
 * field - isi field ini kalau kamu hanya memakai satu provider ber-key.
 */
export class FreeAi implements ICredentialType {
  name = "freeAiApi";

  displayName = "Free AI API (opsional)";

  documentationUrl = "https://github.com/zernio-dev/n8n-nodes-zernio#readme";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: false,
      description:
        "Cadangan generik untuk provider ber-key. Kunci per-provider dari environment (mis. OPENROUTER_API_KEY, TIP_API_KEY, NETRAUX_API_KEY) didahulukan. Kosongkan kalau hanya memakai provider anonim (ovh, llm7, kilo).",
    },
  ];

  // Tidak ada `authenticate`: header Authorization dibangun manual di node,
  // karena tiap provider ber-key memakai env-nya sendiri kalau tersedia.
}
