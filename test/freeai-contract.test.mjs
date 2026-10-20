// Kontrak runtime FreeAi: output shape, retry rules, failover antar provider.
// Mengimpor dist/ (bukan TS) sesuai konvensi repo: test konsumsi dist/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { FreeAi } from "../dist/freeai/FreeAi.node.js";
import { FAILOVER_ORDER, FAILOVER_VALUE, PROVIDERS } from "../dist/freeai/providers.generated.js";

function makeCtx(params, httpImpl, itemCount = 1) {
  return {
    getInputData: () => Array.from({ length: itemCount }, () => ({ json: {} })),
    getNodeParameter: (name) => {
      if (name in params) return params[name];
      throw new Error(`missing param ${name}`);
    },
    getCredentials: async () => ({ apiKey: "" }),
    helpers: { httpRequest: httpImpl },
  };
}

function okBody(text) {
  return { choices: [{ message: { content: text } }] };
}

function run(params, httpImpl, itemCount = 1) {
  const ctx = makeCtx(params, httpImpl, itemCount);
  return FreeAi.prototype.execute.call(ctx);
}

const base = {
  provider: FAILOVER_VALUE,
  prompt: "halo",
  system: "",
  maxTokens: 512,
  temperature: 0.2,
  timeout: 30,
};

test("kontrak output: sukses provider pertama", async () => {
  const calls = [];
  const [out] = await run(
    base,
    async (opts) => {
      calls.push(opts);
      return okBody("  jawaban  ");
    },
    2, // dua item input
  );

  assert.equal(out.length, 2, "satu output per input item");
  for (const item of out) {
    assert.deepEqual(Object.keys(item.json).sort(), [
      "error", "latencyMs", "ok", "provider", "status", "text",
    ]);
    assert.equal(item.json.ok, true);
    assert.equal(item.json.provider, FAILOVER_ORDER[0]);
    assert.equal(item.json.text, "jawaban", "text di-trim");
    assert.equal(item.json.status, 200);
    assert.equal(item.json.error, undefined);
    assert.equal(typeof item.json.latencyMs, "number");
  }
  // URL dibangun dari provider: <base>/chat/completions
  assert.equal(calls[0].url, `${PROVIDERS[FAILOVER_ORDER[0]].base}/chat/completions`);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].json, true);
});

test("empty response: naik budget token, tetap provider sama", async () => {
  const bodies = [];
  const [out] = await run(base, async (opts) => {
    bodies.push(opts.body);
    if (bodies.length < 3) return okBody("   "); // kosong
    return okBody("akhir");
  });

  assert.equal(out[0].json.ok, true);
  assert.equal(out[0].json.provider, FAILOVER_ORDER[0]);
  // attempt 1: 512, attempt 2: max(512*4,512)=2048, attempt 3: max(2048*4,512)=8192
  assert.deepEqual(
    bodies.map((b) => b.max_tokens),
    [512, 2048, 8192],
  );
  assert.equal(bodies[0].model, PROVIDERS[FAILOVER_ORDER[0]].model);
});

test("429: tunggu 5 detik lalu retry provider yang sama", async () => {
  const started = Date.now();
  let n = 0;
  const [out] = await run(base, async () => {
    n++;
    if (n === 1) throw new Error("Request failed with status code 429");
    return okBody("setelah rate limit");
  });

  assert.equal(out[0].json.ok, true);
  assert.equal(n, 2, "429 tidak pindah provider");
  assert.ok(Date.now() - started >= 4900, "jeda ~5 detik dihormati");
});

test("error non-429: pindah ke provider berikutnya", async () => {
  const urls = [];
  const [out] = await run(base, async (opts) => {
    urls.push(opts.url);
    if (urls.length === 1) throw new Error("Request failed with status code 500");
    return okBody("dari provider kedua");
  });

  assert.equal(out[0].json.ok, true);
  assert.equal(out[0].json.provider, FAILOVER_ORDER[1]);
  assert.equal(urls.length, 2);
  assert.ok(urls[1].includes(PROVIDERS[FAILOVER_ORDER[1]].base));
});

test("semua attempt gagal: ok:false dengan error agregat", async () => {
  let n = 0;
  const [out] = await run(
    { ...base, provider: FAILOVER_ORDER[0] }, // ovh: needsKey=false, deterministik
    async () => {
      n++;
      throw new Error("boom");
    },
  );

  assert.equal(out[0].json.ok, false);
  assert.equal(out[0].json.provider, "");
  assert.equal(out[0].json.text, "");
  assert.equal(out[0].json.status, 0);
  assert.equal(out[0].json.latencyMs, 0);
  assert.equal(n, 1, "error non-429 -> break: 1 request per provider");
  assert.match(out[0].json.error, /^semua provider free gagal -> /);
  assert.ok(out[0].json.error.includes("ovh: boom"));
});

test("prompt kosong: throw", async () => {
  await assert.rejects(
    run({ ...base, prompt: "" }, async () => okBody("x")),
    /Prompt kosong/,
  );
});

test("provider spesifik: hanya satu provider dicoba", async () => {
  const urls = [];
  const [out] = await run(
    { ...base, provider: FAILOVER_ORDER[2] },
    async (opts) => {
      urls.push(opts.url);
      throw new Error("down");
    },
  );

  assert.equal(out[0].json.ok, false);
  assert.equal(urls.length, 1, "error non-429 -> break: 1 request per provider");
  assert.ok(urls.every((u) => u.includes(PROVIDERS[FAILOVER_ORDER[2]].base)));
});

test("apiKey kredensial dikirim sebagai Bearer", async () => {
  let auth;
  const ctx = makeCtx(base, async (opts) => {
    auth = opts.headers.Authorization;
    return okBody("ok");
  });
  ctx.getCredentials = async () => ({ apiKey: "kred-123" });
  await FreeAi.prototype.execute.call(ctx);
  assert.equal(auth, "Bearer kred-123");
});
