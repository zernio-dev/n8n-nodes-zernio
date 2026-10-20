/**
 * AUTO-GENERATED — JANGAN edit file ini secara manual.
 *
 * Sumber     : providers.json (free-ai-probe)
 * SHA-256    : 3e968d504be3de58cd3e19ec657d09c3eafd69bb3f36f78b0ef7e655560e0aeb
 * Dihasilkan : scripts/gen-providers.mjs
 * Regenerate : npm run gen-providers
 * Periksa    : npm run check-providers
 */

export interface ProviderDef {
  name: string;
  base: string;
  model: string;
  keyEnv: string | null;
  needsKey: boolean;
}

export interface ProviderOption {
  name: string;
  value: string;
  description: string;
}

/** Nilai opsi failover. Dipertahankan demi workflow n8n yang sudah tersimpan. */
export const FAILOVER_VALUE = "failover3";

/** Hanya provider dengan "core" != false di providers.json. */
export const PROVIDERS: Record<string, ProviderDef> = {
  ovh: {
    name: "OVHcloud AI Endpoints",
    base: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1",
    model: "gpt-oss-20b",
    keyEnv: null,
    needsKey: false,
  },
  llm7: {
    name: "LLM7.io",
    base: "https://api.llm7.io/v1",
    model: "DeepSeek-V4-Flash-0731",
    keyEnv: null,
    needsKey: false,
  },
  openrouter: {
    name: "OpenRouter (free pool)",
    base: "https://openrouter.ai/api/v1",
    model: "openrouter/free",
    keyEnv: "OPENROUTER_API_KEY",
    needsKey: true,
  },
  tip: {
    name: "TipRouter",
    base: "https://tiprouter.my.id/v1",
    model: "tip-auto/free",
    keyEnv: "TIP_API_KEY",
    needsKey: true,
  },
  arzastore: {
    name: "ArzaStore Router",
    base: "https://router.arzastore.com/v1",
    model: "arzastore-auto/free",
    keyEnv: "ARZASTORE_API_KEY",
    needsKey: true,
  },
  cleanapis: {
    name: "CleanAPIs",
    base: "https://cleanapis.com/v1",
    model: "cleanapis-auto/free",
    keyEnv: "CLEANAPIS_API_KEY",
    needsKey: true,
  },
  netraux: {
    name: "Netraux (Bansos GPT 6.1 SOL)",
    base: "https://ai.netraux.eu.cc/v1",
    model: "aws/gpt-6.1-sol",
    keyEnv: "NETRAUX_API_KEY",
    needsKey: true,
  },
  jeroker: {
    name: "Jerouter (Jeroker)",
    base: "https://je.jerouter.web.id/v1",
    model: "auto",
    keyEnv: "JEROKER_API_KEY",
    needsKey: true,
  },
  ghrocx: {
    name: "Ghrocx",
    base: "https://api.ghrocx.my.id/v1",
    model: "ghrocx/sonnet-5",
    keyEnv: "GHROCX_API_KEY",
    needsKey: true,
  },
  kilo: {
    name: "Kilo Code gateway",
    base: "https://api.kilo.ai/api/gateway",
    model: "kilo-auto/free",
    keyEnv: null,
    needsKey: false,
  },
};

/** Urutan failover, persis seperti "failover" di providers.json. */
export const FAILOVER_ORDER: string[] = [
  "ovh",
  "llm7",
  "openrouter",
  "tip",
  "arzastore",
  "cleanapis",
  "netraux",
  "jeroker",
];

/** Opsi dropdown Provider di n8n. */
export const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    name: "OVHcloud AI Endpoints (anonim)",
    value: "ovh",
    description: "gpt-oss-20b — anonim, tanpa key",
  },
  {
    name: "LLM7.io (anonim)",
    value: "llm7",
    description: "DeepSeek-V4-Flash-0731 — anonim, tanpa key",
  },
  {
    name: "OpenRouter (free pool)",
    value: "openrouter",
    description: "openrouter/free — butuh API key (OPENROUTER_API_KEY)",
  },
  {
    name: "TipRouter",
    value: "tip",
    description: "tip-auto/free — butuh API key (TIP_API_KEY)",
  },
  {
    name: "ArzaStore Router",
    value: "arzastore",
    description: "arzastore-auto/free — butuh API key (ARZASTORE_API_KEY)",
  },
  {
    name: "CleanAPIs",
    value: "cleanapis",
    description: "cleanapis-auto/free — butuh API key (CLEANAPIS_API_KEY)",
  },
  {
    name: "Netraux (Bansos GPT 6.1 SOL)",
    value: "netraux",
    description: "aws/gpt-6.1-sol — butuh API key (NETRAUX_API_KEY)",
  },
  {
    name: "Jerouter (Jeroker)",
    value: "jeroker",
    description: "auto — butuh API key (JEROKER_API_KEY)",
  },
  {
    name: "Ghrocx",
    value: "ghrocx",
    description: "ghrocx/sonnet-5 — butuh API key (GHROCX_API_KEY)",
  },
  {
    name: "Kilo Code gateway (anonim)",
    value: "kilo",
    description: "kilo-auto/free — anonim, tanpa key",
  },
];

/** Opsi failover, dibangun dari rantai yang sama. */
export const FAILOVER_OPTION: ProviderOption = {
  name: "Failover otomatis (8 provider)",
  value: FAILOVER_VALUE,
  description: "ovh → llm7 → openrouter → tip → arzastore → cleanapis → netraux → jeroker",
};
