import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionType } from "n8n-workflow";
import {
  FAILOVER_OPTION,
  FAILOVER_ORDER,
  FAILOVER_VALUE,
  PROVIDER_OPTIONS,
  PROVIDERS,
  type ProviderDef,
} from "./providers.generated";

// Daftar provider TIDAK ditulis di sini: dibaca dari providers.json milik
// free-ai-probe lewat scripts/gen-providers.mjs (lihat FREEAI.md).
type ProviderId = string;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Kunci API untuk satu provider. Kunci per-provider dari environment
 * (mis. TIP_API_KEY, NETRAUX_API_KEY) didahulukan karena spesifik, lalu
 * kredensial n8n "Free AI API" sebagai cadangan generik.
 */
function resolveApiKey(p: ProviderDef, credentialKey: string): string {
  const envKey = p.keyEnv ? process.env[p.keyEnv] : undefined;
  return (envKey ?? "").trim() || credentialKey || "";
}

interface UpstreamResult {
  ok: boolean;
  provider: ProviderId | "";
  text: string;
  latencyMs: number;
  status: number;
  error?: string;
}

export class FreeAi implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Free AI (free-tier failover)",
    name: "freeAi",
    icon: "file:zernio-logo.svg",
    group: ["transform"],
    version: 1,
    description:
      "Generate text dengan provider AI free-tier. Daftar provider dan rantai failover dibaca dari providers.json free-ai-probe (npm run gen-providers), jadi tidak ada salinan yang bisa basi.",
    defaults: {
      name: "Free AI",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],

    credentials: [
      {
        name: "freeAiApi",
        required: false,
      },
    ],

    properties: [
      {
        displayName: "Provider",
        name: "provider",
        type: "options",
        default: FAILOVER_VALUE,
        options: [FAILOVER_OPTION, ...PROVIDER_OPTIONS],
        description: "Provider free-tier yang dipakai",
      },
      {
        displayName: "Prompt",
        name: "prompt",
        type: "string",
        typeOptions: { rows: 4 },
        default: "",
        required: true,
        placeholder: "Mis. Ringkas teks berikut...",
        description: "Perintah untuk model. Mendukung ekspresi n8n ({{ $json... }}).",
      },
      {
        displayName: "System Prompt",
        name: "system",
        type: "string",
        typeOptions: { rows: 3 },
        default: "",
        description: "Opsional: instruksi sistem",
      },
      {
        displayName: "Max Tokens",
        name: "maxTokens",
        type: "number",
        typeOptions: { minValue: 16, maxValue: 8192 },
        default: 512,
        description: "Budget token keluaran (model reasoning bisa menghabiskannya)",
      },
      {
        displayName: "Temperature",
        name: "temperature",
        type: "number",
        typeOptions: { minValue: 0, maxValue: 2, numberStepSize: 0.1 },
        default: 0.2,
      },
      {
        displayName: "Timeout (detik)",
        name: "timeout",
        type: "number",
        default: 30,
        description: "Batas waktu per request ke upstream",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const providerChoice = this.getNodeParameter("provider", i) as string;
      const prompt = this.getNodeParameter("prompt", i) as string;
      const system = this.getNodeParameter("system", i, "") as string;
      const maxTokens = this.getNodeParameter("maxTokens", i, 512) as number;
      const temperature = this.getNodeParameter("temperature", i, 0.2) as number;
      const timeout = (this.getNodeParameter("timeout", i, 30) as number) * 1000;

      if (!prompt) {
        throw new Error("Prompt kosong");
      }

      let apiKey = "";
      try {
        const creds = await this.getCredentials("freeAiApi");
        apiKey = String(creds.apiKey ?? "");
      } catch {
        // kredensial opsional belum dibuat -> provider anonim tetap jalan
      }

      const order: ProviderId[] =
        providerChoice === FAILOVER_VALUE
          ? FAILOVER_ORDER
          : [providerChoice];

      const messages: { role: string; content: string }[] = [];
      if (system) messages.push({ role: "system", content: system });
      messages.push({ role: "user", content: prompt });

      const result = await callWithFailover(this, order, {
        messages,
        maxTokens,
        temperature,
        timeout,
        apiKey,
      });

      out.push({
        json: {
          ok: result.ok,
          provider: result.provider,
          text: result.text,
          latencyMs: result.latencyMs,
          status: result.status,
          error: result.error,
        } as INodeExecutionData["json"],
      });
    }

    return [out];
  }

}

async function callWithFailover(
  ctx: IExecuteFunctions,
  order: ProviderId[],
    req: {
      messages: { role: string; content: string }[];
      maxTokens: number;
      temperature: number;
      timeout: number;
      apiKey: string;
    },
  ): Promise<UpstreamResult> {
    const errors: string[] = [];

    for (const pid of order) {
      const p = PROVIDERS[pid];
      if (!p) continue;
      const apiKey = resolveApiKey(p, req.apiKey);
      if (p.needsKey && !apiKey) {
        errors.push(
          `${pid}: butuh API key — set env ${p.keyEnv} atau isi kredensial Free AI`
        );
        continue;
      }

      let effMax = req.maxTokens;
      for (let attempt = 0; attempt < 3; attempt++) {
        const started = Date.now();
        try {
          const body = await ctx.helpers.httpRequest({
            method: "POST",
            url: `${p.base}/chat/completions`,
            headers: {
              "Content-Type": "application/json",
              ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: {
              model: p.model,
              messages: req.messages,
              max_tokens: effMax,
              temperature: req.temperature,
            },
            json: true,
            timeout: req.timeout,
            returnFullResponse: false,
            skipSslCertificateValidation: false,
          });

          const choices = (body as { choices?: { message?: { content?: string } }[] })
            .choices;
          const text = (choices?.[0]?.message?.content ?? "").trim();
          if (text) {
            return {
              ok: true,
              provider: pid,
              text,
              latencyMs: Date.now() - started,
              status: 200,
            };
          }
          // jawaban kosong: model reasoning menghabiskan token -> budget lebih besar
          effMax = Math.max(effMax * 4, 512);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(`${pid}: ${message.slice(0, 120)}`);
          // 429 rate limit -> jeda lalu coba lagi sekali lagi
          if (/429|rate limit/i.test(message)) {
            await sleep(5000);
            continue;
          }
          break;
        }
      }
    }

    return {
      ok: false,
      provider: "",
      text: "",
      latencyMs: 0,
      status: 0,
      error: `semua provider free gagal -> ${errors.join(" | ")}`,
    };
}
