import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const componentPath = path.join(process.cwd(), "components", "cinematic", "CinematicPortfolio.tsx");
let source = await readFile(componentPath, "utf8");

source = source.replace(
  '  const [projectMissing, setProjectMissing] = useState(false);\n  const activeProject = projects[activeIndex];',
  '  const [projectMissing, setProjectMissing] = useState(false);\n  const [stagePosition, setStagePosition] = useState<"before" | "fixed" | "after">("before");\n  const activeProject = projects[activeIndex];',
);

source = source.replace(
  '      const rect = section.getBoundingClientRect();\n      const range = Math.max(1, section.offsetHeight - window.innerHeight);\n      const normalized = clamp(-rect.top / range);',
  '      const rect = section.getBoundingClientRect();\n      const range = Math.max(1, section.offsetHeight - window.innerHeight);\n      const nextStagePosition = rect.top > 0 ? "before" : rect.bottom <= window.innerHeight ? "after" : "fixed";\n      setStagePosition((current) => current === nextStagePosition ? current : nextStagePosition);\n      const normalized = clamp(-rect.top / range);',
);

source = source.replace(
  '<div className="work-scroll-sticky">',
  '<div className={`work-scroll-sticky is-${stagePosition}`}>',
);

await writeFile(componentPath, source, "utf8");
console.log("Applied explicit fixed positioning to the cinematic scroll stage");
