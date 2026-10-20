// Analisis multi-item Late: preSend/postReceive hardcode index parameter 0.
// Konsekuensi: dengan >1 item input, ekspresi {{ $json... }} di-resolve terhadap
// item 0 — bukan item yang sedang dikirim. Test ini mengunci fakta tersebut.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  postsCreatePreSend,
  postsUpdatePreSend,
} from "../dist/late/utils/routingHooks.js";

function mockThis(seen) {
  return {
    getNode: () => ({ name: "Late", typeVersion: 1 }),
    getNodeParameter: (name, index, fallback) => {
      seen.push({ name, index });
      const defaults = {
        content: `konten-${index}`,
        platforms: [],
        publishNow: false,
        isDraft: true, // lolos validasi tanpa accounts loader
        timezone: "UTC",
        visibility: "public",
      };
      return name in defaults ? defaults[name] : fallback;
    },
    getNodeParameterExpression: undefined,
    // expressionProcessor memanggil helper ini saat ada field ekspresi
    getWorkflowStaticData: () => ({}),
  };
}

test("postsCreatePreSend: SEMUA parameter diambil dari item index 0", async () => {
  const seen = [];
  const requestOptions = {};
  const out = await postsCreatePreSend.call(mockThis(seen), requestOptions);

  assert.ok(seen.length > 0, "getNodeParameter terpanggil");
  const indexes = [...new Set(seen.map((s) => s.index))];
  assert.deepEqual(indexes, [0], "hanya index 0 yang dibaca");
  // dengan 2 item input pun, body selalu dibentuk dari parameter item 0
  assert.equal(out.body.content, "konten-0");
});

test("postsUpdatePreSend: juga hardcode index 0", async () => {
  const seen = [];
  const out = await postsUpdatePreSend.call(mockThis(seen), {});

  const indexes = [...new Set(seen.map((s) => s.index))];
  assert.deepEqual(indexes, [0]);
  assert.equal(out.body.content, "konten-0");
});
