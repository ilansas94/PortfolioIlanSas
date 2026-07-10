import { mkdir, readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

const partsDirectory = path.join(process.cwd(), "cinematic-v2-parts");
const partNames = Array.from({ length: 8 }, (_, index) => `${String(index).padStart(3, "0")}.txt`);

const encoded = (await Promise.all(
  partNames.map((name) => readFile(path.join(partsDirectory, name), "utf8")),
)).join("").trim();

const files = JSON.parse(gunzipSync(Buffer.from(encoded, "base64")).toString("utf8"));

for (const [relativePath, content] of Object.entries(files)) {
  const destination = path.join(process.cwd(), relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

console.log(`Prepared ${Object.keys(files).length} cinematic portfolio files from ${partNames.join(", ")}`);
