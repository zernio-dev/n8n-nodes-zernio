#!/usr/bin/env node
/**
 * sync-providers.mjs - satu perintah sinkronisasi antar-repo:
 *   salin providers.json dari free-ai-probe -> regenerate -> verifikasi.
 *
 * Pakai:
 *   node scripts/sync-providers.mjs [path-ke-sumber]   # salin + gen + check
 *   npm run sync-providers                             # di atas + build + test
 *
 * Sumber: argumen posisi -> env FREEAI_PROVIDERS_FILE
 *         -> C:/free-ai-probe/providers.json.
 * Sumber yang disebut eksplisit tapi tidak ada -> GAGAL keras, jangan
 * diam-diam menyalin dari tempat lain (menimpa salinan lokal dari file
 * yang keliru lebih buruk daripada berhenti).
 *
 * Salinan lokal TIDAK pernah ditimpa sebelum sumber tervalidasi: JSON
 * valid, ada provider core, id unik, dan semua id failover dikenal.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const DEST = path.resolve(root, "freeai", "providers.json");

const DEFAULT_SOURCE = "C:/free-ai-probe/providers.json";
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const explicit =
  (positional[0] || process.env.FREEAI_PROVIDERS_FILE || "").trim() || null;

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

function fail(msg) {
  console.error(`[sync-providers] ${msg}`);
  process.exit(1);
}

// --- 1. sumber ---
const sourcePath = path.resolve(explicit || DEFAULT_SOURCE);
if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
  fail(
    `sumber tidak ada: ${sourcePath}\n` +
      (explicit
        ? "  Perbaiki argumen atau FREEAI_PROVIDERS_FILE."
        : "  Berikan path sebagai argumen atau set FREEAI_PROVIDERS_FILE.")
  );
}

const raw = fs.readFileSync(sourcePath, "utf8");

// --- 2. validasi SEBELUM menimpa salinan lokal ---
let src;
try {
  src = JSON.parse(raw);
} catch (err) {
  fail(`sumber bukan JSON valid: ${err.message}`);
}

const providers = src?.providers;
if (!Array.isArray(providers) || providers.length === 0) {
  fail("sumber tidak punya array 'providers' non-kosong");
}
const core = providers.filter((p) => p.core !== false);
if (core.length === 0) {
  fail("sumber tidak punya provider dengan core != false");
}
const ids = core.map((p) => p.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length > 0) {
  fail(`id provider duplikat: ${[...new Set(dupes)].join(", ")}`);
}
const known = new Set(ids);
const failover = Array.isArray(src.failover) ? src.failover : [];
const dangling = failover.filter((id) => !known.has(id));
if (dangling.length > 0) {
  fail(`failover menyebut id di luar core: ${dangling.join(", ")}`);
}

// --- 3. bandingkan dengan salinan lokal (laporkan apa yang berubah) ---
const oldRaw = fs.existsSync(DEST) ? fs.readFileSync(DEST, "utf8") : null;
const identical = oldRaw === raw;

if (oldRaw === null) {
  console.log(
    `[sync-providers] salinan lokal belum ada -> buat baru (${core.length} provider core, ${failover.length} failover).`
  );
} else if (identical) {
  console.log("[sync-providers] salinan lokal sudah identik dengan sumber.");
} else {
  let oldCore = "?";
  let oldFail = "?";
  try {
    const o = JSON.parse(oldRaw);
    oldCore = (o.providers ?? []).filter((p) => p.core !== false).length;
    oldFail = (Array.isArray(o.failover) ? o.failover : []).length;
  } catch {
    /* salinan lama rusak: tetap ditimpa (sumber sudah tervalidasi) */
  }
  console.log(
    `[sync-providers] salinan lokal BERUBAH:\n` +
      `  provider core : ${oldCore} -> ${core.length}\n` +
      `  failover      : ${oldFail} -> ${failover.length}\n` +
      `  sha256        : ${sha(oldRaw).slice(0, 12)} -> ${sha(raw).slice(0, 12)}`
  );
}

// --- 4. salin atomis (temp + rename) ---
if (!identical) {
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  const tmp = `${DEST}.tmp`;
  fs.writeFileSync(tmp, raw, "utf8");
  fs.renameSync(tmp, DEST);
  console.log(
    `[sync-providers] disalin ${sourcePath} -> ${path.relative(root, DEST)}`
  );
}

// --- 5. regenerate ---
console.log("[sync-providers] regenerate providers.generated.ts ...");
const gen = spawnSync(
  process.execPath,
  [path.resolve(__dirname, "gen-providers.mjs")],
  { stdio: "inherit", cwd: root }
);
if (gen.status !== 0) {
  fail(`gen-providers gagal (exit ${gen.status}).`);
}

// --- 6. verifikasi ---
console.log("[sync-providers] verifikasi check-providers ...");
const check = spawnSync(
  process.execPath,
  [path.resolve(__dirname, "gen-providers.mjs"), "--check"],
  { stdio: "inherit", cwd: root }
);
if (check.status !== 0) {
  fail(`check-providers gagal (exit ${check.status}).`);
}

console.log(
  "[sync-providers] sinkron: sumber tervalidasi, salinan == sumber, generated == salinan."
);
