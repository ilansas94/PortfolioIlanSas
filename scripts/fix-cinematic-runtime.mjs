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

const qaAnchor = '  const sceneContent = useMemo(() => {';
const qaHook = `  useEffect(() => {\n    const qa = new URLSearchParams(window.location.search).get("qa");\n    if (!qa) return;\n\n    const directScenes: NavigableScene[] = ["hub", "work", "about", "contact"];\n    if (directScenes.includes(qa as NavigableScene)) {\n      setHandoff(true);\n      setIntroDone(true);\n      setScene(qa as NavigableScene);\n      return;\n    }\n\n    const [mode, rawId] = qa.split("-");\n    const project = projects.find((item) => item.id === Number(rawId));\n    if (!project || (mode !== "case" && mode !== "open" && mode !== "close")) return;\n\n    setHandoff(true);\n    setIntroDone(true);\n    setSelected(project);\n\n    if (mode === "case") {\n      setScene("case");\n      return;\n    }\n\n    if (mode === "close") {\n      setScene("case");\n      const leaveTimer = window.setTimeout(() => {\n        setTransitionLeaving(true);\n        setTransitioning(true);\n      }, 350);\n      const workTimer = window.setTimeout(() => {\n        setScene("work");\n        setTransitioning(false);\n        setTransitionLeaving(false);\n        setSelected(null);\n      }, 1230);\n      return () => {\n        window.clearTimeout(leaveTimer);\n        window.clearTimeout(workTimer);\n      };\n    }\n\n    setScene("work");\n    setTransitionLeaving(false);\n    setTransitioning(true);\n    const delay = project.transition === "ink" ? 900 : 1850;\n    const caseTimer = window.setTimeout(() => {\n      setScene("case");\n      window.setTimeout(() => setTransitioning(false), 420);\n    }, delay);\n    return () => window.clearTimeout(caseTimer);\n  }, []);\n\n`;
if (!component.includes('new URLSearchParams(window.location.search).get("qa")')) {
  component = component.replace(qaAnchor, qaHook + qaAnchor);
}

await writeFile(componentPath, component, "utf8");

let css = await readFile(cssPath, "utf8");
const marker = "/* cinematic handoff synchronization */";
if (!css.includes(marker)) {
  css += `\n\n${marker}\n.opening-film { transition-duration: .92s; }\n.opening-film video { transition-duration: .92s; }\n.opening-film.is-handoff video { opacity: 0; }\n.liquid-nav { transition-duration: .92s, 1.05s; }\n.liquid-label { opacity: 0; filter: blur(7px); transform: translate(-50%, -50%) scale(.94); transition: opacity .5s ease .28s, filter .6s ease .22s, letter-spacing .35s ease, transform .7s cubic-bezier(.2,.8,.2,1) .18s; }\n.liquid-nav.is-visible .liquid-label { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }\n`;
  await writeFile(cssPath, css, "utf8");
}

console.log("Applied cinematic runtime type, QA, and handoff synchronization fixes");
