import { readFile, writeFile } from "node:fs/promises";

const file = "components/cinematic/CinematicPortfolio.tsx";
const source = await readFile(file, "utf8");
const prepared = source.replace(
  '    if (next !== "case") setSelected(null);',
  '    setSelected(null);',
);
if (prepared === source) throw new Error("Expected cinematic source patch was not found");
await writeFile(file, prepared, "utf8");
