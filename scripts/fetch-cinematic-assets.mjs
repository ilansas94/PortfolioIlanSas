import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = [
  {
    name: "intro-formation.mp4",
    url: "https://dnznrvs05pmza.cloudfront.net/kling-3-0-pro/904565633038290986/Locked_camera_and_locked_composition__Preserve_the_exact_central_pen_nib_symbol_without_changing__re.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZDNkNjE5OThiY2IwODFjNCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4Mzg2MDYzMn0.L9DWvDN6B44BW09pjOiiFwNXgONf4Pv870mPFaaT1FM",
  },
];

const directory = path.join(process.cwd(), "public", "cinematic");
await mkdir(directory, { recursive: true });

for (const asset of assets) {
  const destination = path.join(directory, asset.name);
  try {
    const current = await stat(destination);
    if (current.size > 10_000) continue;
  } catch {}

  const response = await fetch(asset.url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Unable to fetch ${asset.name}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength < 10_000) throw new Error(`${asset.name} was unexpectedly small`);
  await writeFile(destination, bytes);
  console.log(`Fetched ${asset.name} (${bytes.byteLength} bytes)`);
}
