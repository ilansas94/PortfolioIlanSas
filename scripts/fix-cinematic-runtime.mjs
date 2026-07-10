import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const componentPath = path.join(process.cwd(), "components/cinematic/CinematicPortfolio.tsx");
const cssPath = path.join(process.cwd(), "app/cinematic-core.css");

let component = await readFile(componentPath, "utf8");

component = component.replace(
  'type Scene = "hub" | "work" | "about" | "contact" | "case";',
  'type Scene = "hub" | "work" | "about" | "contact" | "case";\ntype NavigableScene = Exclude<Scene, "case">;',
);
component = component.replace(
  'function TopRail({ scene, onNavigate }: { scene: Scene; onNavigate: (next: Scene) => void }) {\n  const items: Array<{ id: Scene; label: string }> = [',
  'function TopRail({ scene, onNavigate }: { scene: Scene; onNavigate: (next: NavigableScene) => void }) {\n  const items: Array<{ id: Exclude<NavigableScene, "hub">; label: string }> = [',
);
component = component.replace(
  '  const navigate = (next: Scene) => {\n    if (next === "case") return;\n    setScene(next);\n    if (next !== "case") setSelected(null);\n  };',
  '  const navigate = (next: NavigableScene) => {\n    setScene(next);\n    setSelected(null);\n  };',
);
component = component.replace(
  '              window.setTimeout(() => setIntroDone(true), 120);',
  '              window.setTimeout(() => setIntroDone(true), 920);',
);

await writeFile(componentPath, component, "utf8");

let css = await readFile(cssPath, "utf8");
const marker = "/* cinematic handoff synchronization */";
if (!css.includes(marker)) {
  css += `\n\n${marker}\n.opening-film { transition-duration: .92s; }\n.opening-film video { transition-duration: .92s; }\n.opening-film.is-handoff video { opacity: 0; }\n.liquid-nav { transition-duration: .92s, 1.05s; }\n.liquid-label { opacity: 0; filter: blur(7px); transform: translate(-50%, -50%) scale(.94); transition: opacity .5s ease .28s, filter .6s ease .22s, letter-spacing .35s ease, transform .7s cubic-bezier(.2,.8,.2,1) .18s; }\n.liquid-nav.is-visible .liquid-label { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }\n`;
  await writeFile(cssPath, css, "utf8");
}

console.log("Applied cinematic runtime type and handoff synchronization fixes");
