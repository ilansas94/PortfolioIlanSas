import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

const partsDirectory = path.join(process.cwd(), "cinematic-bundle-parts");
const partNames = (await readdir(partsDirectory))
  .filter((name) => name.endsWith(".txt"))
  .sort();

if (partNames.length === 0) {
  throw new Error("No cinematic bundle parts were found");
}

const encoded = (await Promise.all(
  partNames.map((name) => readFile(path.join(partsDirectory, name), "utf8"))
)).join("").trim();

const files = JSON.parse(gunzipSync(Buffer.from(encoded, "base64")).toString("utf8"));
for (const [relativePath, content] of Object.entries(files)) {
  const destination = path.join(process.cwd(), relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

console.log(`Unpacked ${Object.keys(files).length} cinematic portfolio files`);
