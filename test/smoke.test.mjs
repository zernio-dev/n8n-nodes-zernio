import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = (...parts) => path.resolve(root, "dist", ...parts);
const require_ = createRequire(import.meta.url);

const REQUIRED = [
  "index.js",
  "late/Late.node.js",
  "freeai/FreeAi.node.js",
  "freeai/providers.generated.js",
  "credentials/LateNode.credentials.js",
  "credentials/FreeAi.credentials.js",
];

// Sumber daftar provider, urutannya sama persis dengan gen-providers.mjs:
// env FREEAI_PROVIDERS_FILE -> salinan lokal freeai/providers.json (di-commit,
// jadi selalu ada) -> default lama free-ai-probe. Salinan lokal yang menutup
// celah: tanpa file ini tes akan dilewati senyap di CI dan daftar basi lolos.
const SOURCE_CANDIDATES = [
  process.env.FREEAI_PROVIDERS_FILE,
  path.resolve(root, "freeai", "providers.json"),
  "C:/free-ai-probe/providers.json",
].filter(Boolean);

function findSource() {
  for (const candidate of SOURCE_CANDIDATES) {
    const resolved = path.resolve(candidate);
    if (existsSync(resolved)) return resolved;
  }
  return null;
}

test("dist output contains all files declared in package.json#n8n", () => {
  for (const file of REQUIRED) {
    assert.ok(
      existsSync(dist(file)),
      `missing dist/${file} — run \`npm run build\` first`
    );
  }
});

test("package.json n8n entries point at existing dist files", async () => {
  const pkg = JSON.parse(
    await import("node:fs").then((fs) =>
      fs.readFileSync(path.resolve(root, "package.json"), "utf8")
    )
  );
  const entries = [...(pkg.n8n?.nodes ?? []), ...(pkg.n8n?.credentials ?? [])];
  assert.ok(entries.length > 0, "package.json#n8n has no entries");
  for (const entry of entries) {
    assert.ok(
      existsSync(path.resolve(root, entry)),
      `n8n entry points at missing file: ${entry}`
    );
  }
});

test("provider generated punya bentuk yang dipakai node", () => {
  const gen = require_(dist("freeai", "providers.generated.js"));
  const ids = Object.keys(gen.PROVIDERS);

  assert.ok(ids.length > 0, "PROVIDERS kosong");
  assert.ok(gen.FAILOVER_ORDER.length > 0, "FAILOVER_ORDER kosong");
  assert.equal(
    gen.PROVIDER_OPTIONS.length,
    ids.length,
    "PROVIDER_OPTIONS tidak mencakup semua provider"
  );

  for (const option of gen.PROVIDER_OPTIONS) {
    assert.ok(
      gen.PROVIDERS[option.value],
      `opsi "${option.value}" tidak ada di PROVIDERS`
    );
    assert.ok(option.name, `opsi ${option.value} tanpa label`);
    assert.ok(option.description, `opsi ${option.value} tanpa deskripsi`);
  }

  for (const id of gen.FAILOVER_ORDER) {
    assert.ok(gen.PROVIDERS[id], `failover menyebut id tak dikenal: ${id}`);
  }

  assert.equal(gen.FAILOVER_OPTION.value, gen.FAILOVER_VALUE);

  for (const id of ids) {
    const p = gen.PROVIDERS[id];
    assert.ok(p.base.startsWith("http"), `${id}: base bukan URL`);
    assert.ok(p.model, `${id}: model kosong`);
    assert.equal(
      p.needsKey,
      p.keyEnv !== null,
      `${id}: needsKey tidak konsisten dengan keyEnv`
    );
  }
});

test("provider generated masih sinkron dengan providers.json free-ai-probe", () => {
  const source = findSource();
  if (!source) {
    console.warn(
      "[test] dilewati: providers.json free-ai-probe tidak ditemukan di " +
        SOURCE_CANDIDATES.join(", ")
    );
    return;
  }

  const config = JSON.parse(readFileSync(source, "utf8"));
  const gen = require_(dist("freeai", "providers.generated.js"));
  const core = config.providers.filter((p) => p.core !== false);

  assert.deepEqual(
    Object.keys(gen.PROVIDERS).sort(),
    core.map((p) => p.id).sort(),
    "daftar provider tidak sinkron dengan providers.json"
  );
  assert.deepEqual(
    gen.FAILOVER_ORDER,
    config.failover,
    "urutan failover tidak sinkron dengan providers.json"
  );

  for (const p of core) {
    const g = gen.PROVIDERS[p.id];
    const keyEnv = p.key_env ?? null;
    assert.equal(g.base, p.base, `${p.id}: base beda`);
    assert.equal(g.model, p.model, `${p.id}: model beda`);
    assert.equal(g.keyEnv, keyEnv, `${p.id}: keyEnv beda`);
    assert.equal(g.needsKey, keyEnv !== null, `${p.id}: needsKey beda`);
  }
});

test("sync-providers gagal keras tanpa sumber eksplisit dan tidak menyentuh salinan lokal", () => {
  const pkg = JSON.parse(
    readFileSync(path.resolve(root, "package.json"), "utf8")
  );
  assert.ok(pkg.scripts?.["sync-providers"], "package.json tanpa skrip sync-providers");

  const local = path.resolve(root, "freeai", "providers.json");
  const before = readFileSync(local, "utf8");

  const res = spawnSync(
    process.execPath,
    [path.resolve(root, "scripts", "sync-providers.mjs"),
     path.resolve(root, "freeai", "__sumber_tidak_ada__.json")],
    { encoding: "utf8" }
  );

  assert.notEqual(res.status, 0, "harus exit != 0 saat sumber eksplisit tidak ada");
  assert.match(res.stderr, /tidak ada/i, "pesan error harus menyebut sumber tidak ada");
  assert.equal(
    readFileSync(local, "utf8"),
    before,
    "salinan lokal tidak boleh berubah saat sumber bermasalah"
  );
});
