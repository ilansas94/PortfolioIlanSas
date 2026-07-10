import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const componentPath = path.join(process.cwd(), "components", "cinematic", "CinematicPortfolio.tsx");
let source = await readFile(componentPath, "utf8");

const replaceRequired = (search, replacement, label) => {
  if (!source.includes(search)) throw new Error(`Unable to apply continuous-stage patch: ${label}`);
  source = source.replace(search, replacement);
};

replaceRequired(
  'function WorkScrollStory({ onOpen }: { onOpen: (project: Project) => void }) {',
  'function WorkScrollStory({ onOpen, onNavigate, hubVisible, hubInteractive }: { onOpen: (project: Project) => void; onNavigate: (target: "work" | "about" | "contact") => void; hubVisible: boolean; hubInteractive: boolean }) {',
  "WorkScrollStory signature",
);

replaceRequired(
  '  const liveReveal = clamp((localProgress - 0.86) / 0.12);\n  const movieOpacity = 1 - clamp((localProgress - 0.9) / 0.09);',
  '  const liveReveal = clamp((localProgress - 0.86) / 0.12);\n  const movieOpacity = 1 - clamp((localProgress - 0.9) / 0.09);\n  const hubPresence = targetIndex === 0 ? 1 - smooth(0.015, 0.075, localProgress) : 0;\n  const transitionOpacity = movieOpacity * (targetIndex === 0 ? smooth(0.018, 0.075, localProgress) : 1);',
  "single-layer opacity controls",
);

replaceRequired(
  '      <div className={`v3-film-stage is-${pin}`}>\n        <div className="v3-film-stage__movie" style={{ opacity: movieOpacity }}>',
  '      <div className={`v3-film-stage is-${pin}`}>\n        <HubStage visible={hubVisible && hubPresence > 0.001} interactive={hubInteractive && hubPresence > 0.82} onSelect={onNavigate} />\n        <button className="v3-opening__cue" type="button" onClick={() => onNavigate("work")} tabIndex={hubInteractive && hubPresence > 0.82 ? 0 : -1} style={{ opacity: hubPresence, pointerEvents: hubInteractive && hubPresence > 0.82 ? "auto" : "none" }}><span>Scroll to enter the work</span><i /></button>\n        <div className="v3-film-stage__movie" style={{ opacity: transitionOpacity }}>',
  "hub inside pinned stage",
);

replaceRequired(
  '    const updateZone = () => setJourneyZone(window.scrollY > window.innerHeight * 0.72 ? "work" : "home");',
  '    const updateZone = () => setJourneyZone(window.scrollY > window.innerHeight * 0.08 ? "work" : "home");',
  "journey zone threshold",
);

replaceRequired(
  '      else document.getElementById("work-story")?.scrollIntoView({ behavior: "smooth", block: "start" });',
  '      else window.scrollTo({ top: Math.max(120, window.innerHeight * 0.12), behavior: "smooth" });',
  "work navigation",
);

const oldJourney = `      <div className={\`v3-journey \${mode === "journey" ? "is-current" : ""}\`} aria-hidden={mode !== "journey"}>
        <section className="v3-opening" aria-label="Portfolio opening">
          {!introDone && !introFailed && (
            <video
              className={\`v3-opening__film \${introNearEnd ? "is-ending" : ""}\`}
              src="/cinematic/intro-master.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => event.currentTarget.play().catch(() => setIntroFailed(true))}
              onTimeUpdate={(event) => {
                const video = event.currentTarget;
                if (video.duration && video.currentTime >= video.duration - 0.12) setIntroNearEnd(true);
              }}
              onEnded={() => { setIntroNearEnd(true); window.setTimeout(() => setIntroDone(true), 80); }}
              onError={() => { setIntroFailed(true); setIntroNearEnd(true); window.setTimeout(() => setIntroDone(true), 160); }}
            />
          )}
          <HubStage visible={hubVisible} interactive={introDone && mode === "journey"} onSelect={(target) => goTo(target)} />
          <button className="v3-opening__cue" type="button" onClick={() => goTo("work")} tabIndex={introDone ? 0 : -1}><span>Scroll to enter the work</span><i /></button>
        </section>
        <WorkScrollStory onOpen={openProject} />
      </div>`;

const newJourney = `      {!introDone && !introFailed && (
        <video
          className={\`v3-opening__film \${introNearEnd ? "is-ending" : ""}\`}
          src="/cinematic/intro-master.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => event.currentTarget.play().catch(() => setIntroFailed(true))}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (video.duration && video.currentTime >= video.duration - 0.12) setIntroNearEnd(true);
          }}
          onEnded={() => { setIntroNearEnd(true); window.setTimeout(() => setIntroDone(true), 80); }}
          onError={() => { setIntroFailed(true); setIntroNearEnd(true); window.setTimeout(() => setIntroDone(true), 160); }}
        />
      )}

      <div className={\`v3-journey \${mode === "journey" ? "is-current" : ""}\`} aria-hidden={mode !== "journey"}>
        <WorkScrollStory onOpen={openProject} onNavigate={(target) => goTo(target)} hubVisible={hubVisible} hubInteractive={introDone && mode === "journey"} />
      </div>`;

replaceRequired(oldJourney, newJourney, "continuous journey markup");

await writeFile(componentPath, source, "utf8");
console.log("Unified the hub and all project films into one continuous pinned scroll stage");
