import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "components", "cinematic", "CinematicPortfolioV3.tsx");
const destination = path.join(root, "components", "cinematic", "CinematicPortfolio.tsx");
const globalsPath = path.join(root, "app", "globals.css");

await copyFile(source, destination);

let globals = await readFile(globalsPath, "utf8");
const importLine = '@import "./cinematic-v3.css";';
if (!globals.includes(importLine)) globals = `${globals.trim()}\n${importLine}\n`;
await writeFile(globalsPath, globals, "utf8");

console.log("Applied single-layer cinematic portfolio V3");