import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "components", "cinematic", "CinematicPortfolioRedo.tsx");
const destination = path.join(root, "components", "cinematic", "CinematicPortfolio.tsx");
const globalsPath = path.join(root, "app", "globals.css");

await copyFile(source, destination);

let component = await readFile(destination, "utf8");
component = component.replace(
  'style={{ "--story-units": units } as React.CSSProperties}',
  'style={{ "--story-units": units, "--story-height": `${units * 165}vh`, "--story-height-mobile": `${units * 145}svh`, "--story-height-reduced": `${units * 115}vh` } as React.CSSProperties}',
);
await writeFile(destination, component, "utf8");

let globals = await readFile(globalsPath, "utf8");
for (const importLine of ['@import "./cinematic-scroll-redo.css";', '@import "./cinematic-scroll-fix.css";']) {
  if (!globals.includes(importLine)) globals = `${globals.trim()}\n${importLine}\n`;
}
await writeFile(globalsPath, globals, "utf8");

console.log("Applied scroll-scrubbed cinematic portfolio redo with concrete story heights");
