import { readFile, writeFile } from "node:fs/promises";

const portfolioFile = "components/cinematic/CinematicPortfolio.tsx";
let portfolio = await readFile(portfolioFile, "utf8");

portfolio = portfolio.replace(
  "function ProjectOrbit({ onOpen }: { onOpen: (project: Project) => void }) {",
  "function ProjectOrbit({ onOpen, compact }: { onOpen: (project: Project) => void; compact: boolean }) {",
);

portfolio = portfolio.replace(
  `          const visible = distance <= 3;
          const x = offset * 29;
          const scale = Math.max(0.55, 1 - distance * 0.17);
          const z = -distance * 220;
          const rotate = offset * -13;
          const y = distance === 0 ? 0 : 5 + distance * 2;`,
  `          const visible = distance <= (compact ? 1 : 3);
          const x = offset * (compact ? 52 : 29);
          const scale = compact ? Math.max(0.48, 1 - distance * 0.34) : Math.max(0.55, 1 - distance * 0.17);
          const z = -distance * (compact ? 150 : 220);
          const rotate = offset * (compact ? -7 : -13);
          const y = compact ? (distance === 0 ? -3 : 1) : (distance === 0 ? 0 : 5 + distance * 2);`,
);

portfolio = portfolio.replace(
  'if (scene === "work") return <ProjectOrbit onOpen={openProject} />;',
  'if (scene === "work") return <ProjectOrbit onOpen={openProject} compact={compactIntro} />;',
);
portfolio = portfolio.replace(
  "  }, [scene, selected]);",
  "  }, [scene, selected, compactIntro]);",
);

const requiredPortfolioMarkers = [
  "compact: boolean",
  "distance <= (compact ? 1 : 3)",
  "compact={compactIntro}",
  "[scene, selected, compactIntro]",
];
for (const marker of requiredPortfolioMarkers) {
  if (!portfolio.includes(marker)) throw new Error(`Mobile orbit patch failed at ${marker}`);
}
await writeFile(portfolioFile, portfolio, "utf8");

const responsiveFile = "app/cinematic-responsive.css";
let responsive = await readFile(responsiveFile, "utf8");
const marker = "/* Mobile orbit is a focused carousel, not a compressed desktop stage. */";
if (!responsive.includes(marker)) {
  responsive += `

${marker}
@media (max-width: 820px) {
  .project-vessel { width: 72vw; }
  .project-vessel:not(.is-active) .project-vessel__meta { opacity: 0; pointer-events: none; }
  .project-vessel__meta { bottom: -68px; transition: opacity .35s ease; }
  .project-vessel__meta strong { font-size: 19px; }
  .project-vessel__meta em { font-size: 7px; }
  .orbit-scene__caption { top: 11vh; }
  .orbit-floor { bottom: 13vh; }
  .orbit-controls { bottom: 3.5vh; gap: 12px; }
  .orbit-controls__ticks { gap: 5px; max-width: 56vw; overflow: hidden; }
  .orbit-controls__ticks button { width: 8px; }
  .orbit-controls__ticks button.is-active { width: 24px; }
}
`;
}
await writeFile(responsiveFile, responsive, "utf8");
