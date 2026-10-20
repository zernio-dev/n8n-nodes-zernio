#!/usr/bin/env node
/**
 * gen-providers.mjs - hasilkan freeai/providers.generated.ts dari providers.json
 * milik free-ai-probe, supaya node n8n tidak lagi menyimpan salinan daftar
 * provider yang bisa basi.
 *
 * Pakai:
 *   node scripts/gen-providers.mjs [path-ke-providers.json]   # tulis file
 *   node scripts/gen-providers.mjs --check [path]             # hanya periksa
 *
 * Sumber: argumen posisi -> env FREEAI_PROVIDERS_FILE -> freeai/providers.json
 *         (salinan yang di-commit di repo ini, jadi check tetap jalan di CI).
 *
 * Aturan saat sumber tidak ada:
 *   - disebut eksplisit (argumen/env) -> GAGAL keras; sumber yang salah jangan
 *     diam-diam diganti, karena mode tulis bisa menimpa dari file yang keliru.
 *   - hanya default bawaan yang tidak ada -> mode --check LEWAT dengan exit 0,
 *     karena paket ini dipublikasikan dan mesin lain (CI/Docker) tidak punya
 *     free-ai-probe tapi tetap harus bisa `npm pack`.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const OUT = path.resolve(root, "freeai", "providers.generated.ts");

const args = process.argv.slice(2);
const check = args.includes("--check");
const positional = args.filter((a) => !a.startsWith("--"));

const DEFAULT_SOURCE = path.resolve(root, "freeai", "providers.json");
const explicitSource =
  (positional[0] || process.env.FREEAI_PROVIDERS_FILE || "").trim() || null;

function resolveSource() {
  const candidate = explicitSource ? path.resolve(explicitSource) : path.resolve(DEFAULT_SOURCE);
  const exists = fs.existsSync(candidate) && fs.statSync(candidate).isFile();
  return { path: candidate, exists, explicit: Boolean(explicitSource) };
}

function ts(value) {
  return JSON.stringify(value);
}

function buildContent(raw) {
  const source = JSON.parse(raw);
  const providers = (source.providers ?? []).filter((p) => p.core !== false);
  if (providers.length === 0) {
    throw new Error("providers.json tidak punya provider dengan core != false");
  }

  const ids = providers.map((p) => p.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) {
    throw new Error(`id provider duplikat: ${[...new Set(dupes)].join(", ")}`);
  }

  const known = new Set(ids);
  const failover = source.failover ?? [];
  const dangling = failover.filter((id) => !known.has(id));
  if (dangling.length > 0) {
    throw new Error(
      `failover menyebut id yang bukan provider core: ${dangling.join(", ")}`
    );
  }

  // Normalisasi CRLF -> LF: hash harus identik di checkout Windows
  // (core.autocrlf=true) maupun Linux, sehingga --check tidak pernah
  // melaporkan BASI semu akibat perbedaan line ending saja.
  const digest = crypto.createHash("sha256")
    .update(raw.replace(/\r\n/g, "\n"))
    .digest("hex");

  const providerEntries = providers
    .map((p) => {
      const keyEnv = p.key_env ?? null;
      return [
        `  ${p.id}: {`,
        `    name: ${ts(p.name)},`,
        `    base: ${ts(p.base)},`,
        `    model: ${ts(p.model)},`,
        `    keyEnv: ${keyEnv === null ? "null" : ts(keyEnv)},`,
        `    needsKey: ${keyEnv === null ? "false" : "true"},`,
        `  },`,
      ].join("\n");
    })
    .join("\n");

  const optionEntries = providers
    .map((p) => {
      const label = p.key_env ? p.name : `${p.name} (anonim)`;
      const detail = p.key_env
        ? `${p.model} — butuh API key (${p.key_env})`
        : `${p.model} — anonim, tanpa key`;
      return [
        "  {",
        `    name: ${ts(label)},`,
        `    value: ${ts(p.id)},`,
        `    description: ${ts(detail)},`,
        "  },",
      ].join("\n");
    })
    .join("\n");

  return `/**
 * AUTO-GENERATED — JANGAN edit file ini secara manual.
 *
 * Sumber     : providers.json (free-ai-probe)
 * SHA-256    : ${digest}
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
${providerEntries}
};

/** Urutan failover, persis seperti "failover" di providers.json. */
export const FAILOVER_ORDER: string[] = [
${failover.map((id) => `  ${ts(id)},`).join("\n")}
];

/** Opsi dropdown Provider di n8n. */
export const PROVIDER_OPTIONS: ProviderOption[] = [
${optionEntries}
];

/** Opsi failover, dibangun dari rantai yang sama. */
export const FAILOVER_OPTION: ProviderOption = {
  name: ${ts(`Failover otomatis (${failover.length} provider)`)},
  value: FAILOVER_VALUE,
  description: ${ts(failover.join(" → "))},
};
`;
}

const { path: sourcePath, exists: sourceExists, explicit } = resolveSource();

if (!sourceExists) {
  if (explicit) {
    console.error(
      `[gen-providers] file sumber yang ditunjuk tidak ada: ${sourcePath}\n` +
        `  Perbaiki argumen atau FREEAI_PROVIDERS_FILE.`
    );
    process.exit(1);
  }
  if (check) {
    console.warn(
      `[gen-providers] dilewati: sumber bawaan tidak ada (${sourcePath}).`
    );
    process.exit(0);
  }
  console.error(
    `[gen-providers] providers.json tidak ditemukan di ${sourcePath}.\n` +
      `  Berikan path sebagai argumen atau set FREEAI_PROVIDERS_FILE.`
  );
  process.exit(1);
}

const raw = fs.readFileSync(sourcePath, "utf8");
let content;
try {
  content = buildContent(raw);
} catch (err) {
  console.error(`[gen-providers] ${err.message}`);
  process.exit(1);
}

const current = fs.existsSync(OUT)
  ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n")
  : null;

if (check) {
  if (current === null) {
    console.error(
      `[gen-providers] ${path.relative(root, OUT)} belum ada — jalankan \`npm run gen-providers\`.`
    );
    process.exit(1);
  }
  if (current !== content) {
    console.error(
      `[gen-providers] ${path.relative(root, OUT)} BASI terhadap ${sourcePath}.\n` +
        `  Jalankan \`npm run gen-providers\` lalu commit hasilnya.`
    );
    process.exit(1);
  }
  console.log(
    `[gen-providers] sinkron dengan ${sourcePath} (${path.relative(root, OUT)}).`
  );
  process.exit(0);
}

if (current === content) {
  console.log(
    `[gen-providers] tidak ada perubahan (${path.relative(root, OUT)} sudah sinkron).`
  );
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, content, "utf8");
console.log(
  `[gen-providers] ditulis ${path.relative(root, OUT)} dari ${sourcePath}.`
);
