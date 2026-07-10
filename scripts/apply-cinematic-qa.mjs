import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const componentPath = path.join(process.cwd(), "components", "cinematic", "CinematicPortfolio.tsx");
let source = await readFile(componentPath, "utf8");

const marker = "  const activeNav: NavTarget = mode === \"about\" ? \"about\" : mode === \"contact\" ? \"contact\" : journeyZone;";
const insertion = `  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const projectId = Number(query.get("qaProject"));
    const caseId = Number(query.get("qaCase"));
    if (!projectId && !caseId) return;

    setHandoff(true);
    setIntroDone(true);
    if (caseId) {
      const project = projects.find((item) => item.id === caseId);
      if (project) {
        setSelected(project);
        setMode("case");
      }
      return;
    }

    const index = projects.findIndex((item) => item.id === projectId);
    if (index < 0) return;
    setMode("journey");
    const moveToCheckpoint = () => {
      const section = document.getElementById("work-story");
      if (!section) return;
      const units = projects.length + 1;
      const progress = (1 + index + 0.96) / units;
      const target = section.offsetTop + (section.offsetHeight - window.innerHeight) * progress;
      window.scrollTo({ top: target, behavior: "auto" });
    };
    [100, 420, 1100].forEach((delay) => window.setTimeout(moveToCheckpoint, delay));
  }, []);

${marker}`;

if (!source.includes("qaProject")) {
  source = source.replace(marker, insertion);
  await writeFile(componentPath, source, "utf8");
}

console.log("Applied isolated cinematic QA checkpoints");
