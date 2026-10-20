# Free AI node

Node **Free AI** (`freeai/FreeAi.node.ts`) menghasilkan teks lewat provider AI
free-tier dengan failover otomatis antar provider.

## Daftar provider tidak ditulis tangan di repo ini

Daftar provider dan rantai failover berasal dari **satu sumber**: `providers.json`
milik proyek [free-ai-probe](C:/free-ai-probe/providers.json). Yang **tidak** ada
di repo ini adalah salinan yang ditulis tangan — `FreeAi.node.ts` tidak menyimpan
daftarnya, jadi tidak ada versi yang bisa ketinggalan zaman.

Repo ini memegang **satu salinan** di `freeai/providers.json`, di-commit. Salinan
itu hanya dibaca oleh generator dan `check-providers` — **tidak** dipakai node
saat jalan — sehingga CI tetap bisa memverifikasi kebaruan daftar tanpa menguji
dependensi silang antar-repo. Node sendiri hanya memakai hasil generate, jadi
daftarnya tidak bisa ketinggalan zaman.

Alurnya:

```
free-ai-probe/providers.json  ──salin──▶  freeai/providers.json   (di-commit)
                                              │  scripts/gen-providers.mjs
                                              ▼
                                   freeai/providers.generated.ts  (di-commit)
                                              │  tsc
                                              ▼
                                   dist/freeai/providers.generated.js  (dipakai node)
```

### Perintah

| perintah | fungsi |
|----------|--------|
| `npm run gen-providers` | tulis ulang `freeai/providers.generated.ts` dari `providers.json` |
| `npm run check-providers` | gagal kalau file hasil generate **basi** terhadap sumbernya |
| `npm run sync-providers` | salin `providers.json` dari free-ai-probe, lalu regenerate + build + test |

`check-providers` ikut berjalan di `prepack`, jadi mempublikasikan daftar yang basi
akan ketahuan saat build — termasuk di CI, karena salinan `freeai/providers.json`
ikut ter-commit dan ikut terbaca. Pemeriksaan hanya **dilewati** kalau file
itu tidak ada di checkout **dan** tidak ada sumber eksplisit; saat itu `npm pack`
tetap jalan di mesin yang tidak punya repo asal, bukan gagal.

Sumber ditentukan dengan urutan: argumen posisi → `FREEAI_PROVIDERS_FILE` →
`freeai/providers.json` (salinan lokal). Kalau kamu menunjuk file secara eksplisit
dan file itu tidak ada, perintahnya **gagal**, bukan diam-diam memakai yang lain.

```bash
# arahkan ke salinan providers.json yang lain
FREEAI_PROVIDERS_FILE=/path/ke/providers.json npm run gen-providers
node scripts/gen-providers.mjs /path/ke/providers.json
```

### Menambah provider

Cukup di `free-ai-probe/providers.json`, lalu:

```bash
cd n8n-nodes-zernio
npm run gen-providers && npm run build
```

Dropdown Provider, rantai failover, dan labelnya semuanya ikut sendiri.

### Sinkronisasi antar-repo

Kalau `free-ai-probe/providers.json` sudah berubah, satu perintah menyalinnya
ke repo ini, me-regenerate, lalu memverifikasi semuanya:

```bash
npm run sync-providers
```

Urutannya: validasi sumber (JSON valid, provider core ada, id unik, semua id
failover dikenal — salinan lokal **tidak pernah** ditimpa sebelum lolos
validasi) → salin atomis → `gen-providers` → `check-providers` → `build` →
`test`. Langkah yang gagal menghentikan perintah dengan exit code bukan-nol;
kalau sumber berubah, skrip melaporkan delta provider/failover dan sha256
sebelum menimpa.

Penting — dua perintah membaca sumber berbeda:

- `gen-providers` / `check-providers` → salinan **lokal** `freeai/providers.json`
  (urutan: argumen → `FREEAI_PROVIDERS_FILE` → salinan lokal)
- `sync-providers` → sumber **hulu** (urutan: argumen → `FREEAI_PROVIDERS_FILE`
  → `C:/free-ai-probe/providers.json`)

Sumber eksplisit yang tidak ada membuat keduanya **gagal**, bukan diam-diam
memakai file lain.

Di PR, `.github/workflows/ci.yml` menjalankan `check-providers` + `build` +
`test` otomatis, jadi daftar basi ketahuan tanpa dijalankan manual.

## Kunci API

Dua sumber, dengan urutan prioritas:

1. **Environment, per-provider** — nama variabelnya diambil dari field `key_env`
   di `providers.json`. Ini didahulukan karena spesifik.
2. **Kredensial n8n `Free AI API`** — satu field `apiKey`, dipakai sebagai cadangan
   generik.

Urutan ini penting: satu kredensial n8n hanya bisa memuat **satu** kunci, sedangkan
tiap provider ber-key memakai kunci berbeda. Kalau kamu hanya memakai satu provider
ber-key, kredensial sudah cukup. Kalau mau failover melewati beberapa provider
ber-key, isi env masing-masing supaya tiap provider menerima kunci yang benar.

| provider | butuh key | env |
|----------|-----------|-----|
| `ovh` | tidak | — |
| `llm7` | tidak | — |
| `kilo` | tidak | — |
| `openrouter` | ya | `OPENROUTER_API_KEY` |
| `tip` | ya | `TIP_API_KEY` |
| `arzastore` | ya | `ARZASTORE_API_KEY` |
| `cleanapis` | ya | `CLEANAPIS_API_KEY` |
|| `netraux` | ya | `NETRAUX_API_KEY` |
|| `jeroker` | ya | `JEROKER_API_KEY` |
|| `ghrocx` | ya | `GHROCX_API_KEY` |

Tabel ini menggambarkan `providers.json` saat ini. Provider ber-key yang env-nya
kosong **dilewati** dengan catatan di field `error` keluaran node, bukan digagalkan.

## Kenapa tidak membaca `providers.json` saat runtime

Paket ini dipublikasikan (`"files": ["dist"]`) dan n8n memasang community node ke
dalam `node_modules`, sering di dalam Docker. Path ke `free-ai-probe` tidak akan ada
di sana. Karena itu daftarnya di-**generate saat build** dan di-commit, sehingga
paket tetap mandiri dan portabel.

## Keluaran node

| field | arti |
|-------|------|
| `ok` | apakah ada provider yang berhasil |
| `provider` | id provider yang menang |
| `text` | jawaban |
| `latencyMs` | latensi panggilan yang menang |
| `status` | status HTTP (200 saat sukses; 0 kalau gagal sebelum ada respons) |
| `error` | ringkasan kegagalan semua provider, termasuk yang dilewati karena tanpa key |
