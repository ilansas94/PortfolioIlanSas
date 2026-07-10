import { readFile, writeFile } from "node:fs/promises";

const file = "components/cinematic/LiquidNav.tsx";
const source = await readFile(file, "utf8");
const tuned = source.replace(
  "const mainRadius = mobile ? 0.07 : 0.071;",
  "const mainRadius = mobile ? 0.052 : 0.071;",
);
if (tuned === source) throw new Error("Mobile liquid radius patch was not found");
await writeFile(file, tuned, "utf8");
