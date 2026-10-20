// Regresi: route Late tidak boleh menggandakan prefix /v1. baseURL Late adalah
// https://zernio.com/api/v1; route yang diawali /v1 menghasilkan /api/v1/v1/...
// dan dibalas 404 oleh API zernio (diverifikasi langsung 2026-10-19).
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resourcesDir = path.resolve(__dirname, "..", "dist", "late", "resources");

test("route Late tidak menggandakan prefix /v1 di atas baseURL", () => {
  const files = readdirSync(resourcesDir).filter((f) => f.endsWith(".js"));
  assert.ok(files.length > 0, "dist/late/resources kosong — jalankan build dulu");

  const doubled = [];
  for (const file of files) {
    const source = readFileSync(path.join(resourcesDir, file), "utf8");
    for (const match of source.matchAll(/url:\s*([`"'])(=?)\/v1\//g)) {
      doubled.push(`${file}: ${match[0]}`);
    }
  }
  assert.deepEqual(doubled, [], "route dengan prefix /v1 ganda:\n" + doubled.join("\n"));
});
