import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const from = (...parts) => path.resolve(root, ...parts);
const to = (...parts) => path.resolve(root, "dist", ...parts);

const assets = [
  { from: from("late", "zernio-logo.svg"), to: to("late", "zernio-logo.svg") },
  { from: from("late", "late-logo.svg"), to: to("late", "late-logo.svg") },
  { from: from("late", "zernio-logo.svg"), to: to("freeai", "zernio-logo.svg") },
];

for (const { from, to } of assets) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}
