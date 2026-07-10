"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CinematicRecut.module.css";

type Scene = "home" | "about" | "work" | "contact";

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  detailImage: string;
  tags: string[];
  highlights: string[];
  deliverables: string[];
  tools: string[];
  figmaUrl?: string;
};

type FilmJob = {
  id: number;
  src: string;
  reverse?: boolean;
  startAt?: number;
  endAt?: number;
  swapAt?: number;
  onSwap: () => void;
  onDone?: () => void;
};

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const projects: Project[] = [
  {
    id: 2,
    title: "Company Redesign",
    category: "Brand identity",
    description:
      "A playful bilingual identity built around a celebratory splash mark, a vivid color system, and applications that feel energetic without losing clarity.",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    tags: ["Branding", "Logo design", "Identity"],
    highlights: ["Bilingual visual system", "Energetic CMYK-led palette", "Flexible event applications"],
    deliverables: ["Primary and secondary marks", "Stationery and social templates", "Event collateral"],
    tools: ["Illustrator", "Photoshop"],
  },
  {
    id: 3,
    title: "HAKAMERI Brochure",
    category: "Editorial design",
    description:
      "A multi-page brochure shaped by a strict grid, generous white space, image-first spreads, and press-ready CMYK production.",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    detailImage: "/Essets/BROCHURE HAKAMERI_inside.jpg",
    tags: ["Print", "Brochure", "Layout"],
    highlights: ["Twelve-page visual rhythm", "Offset-print preparation", "Clear typographic hierarchy"],
    deliverables: ["Print-ready PDF", "Source files", "Press proof guidance"],
    tools: ["InDesign", "Photoshop"],
  },
  {
    id: 5,
    title: "Digital Painting",
    category: "Digital art",
    description:
      "A layered illustrative piece focused on atmosphere, painterly texture, color harmony, and a cinematic sense of light.",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    tags: ["Illustration", "Painting", "Portrait"],
    highlights: ["Atmospheric lighting", "Textured brushwork", "Color scripting"],
    deliverables: ["High-resolution artwork", "Process frames"],
    tools: ["Photoshop", "Procreate"],
  },
  {
    id: 6,
    title: "Gesture Poster",
    category: "Poster design",
    description:
      "An exploration of motion through expressive line work, layered textures, and a composition designed to hold up at large scale.",
    image: "/Essets/GESTURE POSTER.jpg",
    detailImage: "/Essets/GESTURE POSTER_inside.jpg",
    tags: ["Poster", "Art direction", "Print"],
    highlights: ["Dynamic composition", "Texture-led depth", "Large-format optimization"],
    deliverables: ["Print PDF", "Large-format artwork"],
    tools: ["Illustrator", "Photoshop"],
  },
  {
    id: 8,
    title: "Keren Nails",
    category: "Logo design",
    description:
      "A clean feminine mark balanced for signage, appointment cards, social profiles, and small-format reproduction.",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    tags: ["Logo", "Beauty", "Branding"],
    highlights: ["Soft curves", "Small-size clarity", "Restrained color system"],
    deliverables: ["Logo files", "Card and sign layouts"],
    tools: ["Illustrator"],
  },
  {
    id: 9,
    title: "Graphic Course",
    category: "UI / UX",
    description:
      "A responsive course landing page with a clear offer, syllabus, pricing, testimonials, and a complete clickable prototype.",
    image: "/Essets/LANDING PAGE PROTOTYPE.png",
    detailImage: "/Essets/LANDING.png",
    tags: ["UI/UX", "Web design", "Prototype"],
    highlights: ["Above-the-fold clarity", "Responsive constraints", "Clickable user flows"],
    deliverables: ["Figma prototype", "Style tokens", "Asset exports"],
    tools: ["Figma"],
    figmaUrl:
      "https://www.figma.com/proto/ymSXBm9a0tVh8VRAI62r3R/Landing-Page-%E2%80%93-Mini-Graphic-Course?content-scaling=fixed&embed-host=share&kind=proto&node-id=1-3&page-id=0%3A1&scaling=scale-down&theme=light&version=2",
  },
  {
    id: 10,
    title: "PASSPORTOGO",
    category: "Brand identity",
    description:
      "A friendly travel identity combining movement and direction cues, designed to stay clear from app-icon scale to print.",
    image: "/Essets/PASSPORTOGO.png",
    detailImage: "/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg",
    tags: ["Logo", "Travel", "Identity"],
    highlights: ["Motion cues", "Arrow symbolism", "Icon-first system"],
    deliverables: ["Logo pack", "Icon set"],
    tools: ["Illustrator"],
  },
  {
    id: 11,
    title: "Sketchbook",
    category: "Illustration",
    description:
      "Selected pages from ongoing studies in anatomy, objects, composition, and rapid visual ideation.",
    image: "/Essets/SKETCHBOOK.jpg",
    detailImage: "/Essets/SKETCHBOOK_inside.jpg",
    tags: ["Sketch", "Concept", "Process"],
    highlights: ["Gesture studies", "Object analysis", "Composition thumbnails"],
    deliverables: ["Curated page selections", "Process snapshots"],
    tools: ["Pencil", "Ink", "Procreate"],
  },
  {
    id: 13,
    title: "SPACE",
    category: "Logo design",
    description:
      "A modern mark inspired by orbit, negative space, and the contrast between a dark field and a precise luminous symbol.",
    image: "/Essets/SPACE LOGO.jpg",
    detailImage: "/Essets/SPACE LOGO_inside.jpg",
    tags: ["Logo", "Technology", "Identity"],
    highlights: ["Negative-space motif", "Dark-mode system", "Wide scale range"],
    deliverables: ["Logo files", "Usage guidance"],
    tools: ["Illustrator"],
  },
  {
    id: 14,
    title: "THE GRIND",
    category: "Logo design",
    description:
      "A robust coffee badge built for reproduction on cups, stickers, packaging, signage, and merchandise.",
    image: "/Essets/THE GRIND LOGO.jpg",
    detailImage: "/Essets/THE GRIND LOGO_inside.jpg",
    tags: ["Logo", "Packaging", "Branding"],
    highlights: ["Condensed forms", "One-color production", "Sticker-ready silhouette"],
    deliverables: ["Logo pack", "Merchandise layouts"],
    tools: ["Illustrator"],
  },
  {
    id: 15,
    title: "Twitchy Rabbit",
    category: "Character identity",
    description:
      "An energetic mascot for gaming and streaming, built around an instantly readable silhouette and expressive features.",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    tags: ["Mascot", "Gaming", "Logo"],
    highlights: ["Strong silhouette", "Expressive character", "Avatar-ready system"],
    deliverables: ["Logo and mascot files", "Profile and header assets"],
    tools: ["Illustrator", "Photoshop"],
  },
];

const filmRoot = "/cinematic-recut";
const projectFilm = (projectId: number) => `${filmRoot}/project-${projectId}.mp4`;
const betweenFilm = (fromId: number, toId: number) => `${filmRoot}/transitions/${fromId}-to-${toId}.mp4`;

function LiquidButton({
  children,
  onClick,
  ariaLabel,
  subtle = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.liquidButton} ${subtle ? styles.liquidButtonSubtle : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      <i />
      <i />
    </button>
  );
}

function FrozenProjectFilm({ project }: { project: Project }) {
  const ref = useRef<HTMLVideoElement>(null);

  const seekToLastFrame = useCallback(() => {
    const video = ref.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.08);
  }, []);

  return (
    <div className={styles.projectFilmFrame}>
      <img src={project.image} alt="" aria-hidden="true" />
      <video
        key={project.id}
        ref={ref}
        src={projectFilm(project.id)}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={seekToLastFrame}
        onSeeked={(event) => event.currentTarget.pause()}
        aria-hidden="true"
      />
    </div>
  );
}

function FilmLayer({ job, onFinish }: { job: FilmJob; onFinish: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const swapped = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let animationFrame = 0;
    let previousFrame = 0;
    const swapPoint = job.swapAt ?? 0.52;

    const swap = () => {
      if (swapped.current) return;
      swapped.current = true;
      job.onSwap();
    };

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      swap();
      job.onDone?.();
      onFinish();
    };

    const begin = async () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 4;
      const start = Math.max(0, Math.min(job.startAt ?? 0, duration));
      const end = Math.max(start + 0.05, Math.min(job.endAt ?? duration, duration));
      const segmentDuration = end - start;

      if (job.reverse) {
        video.pause();
        video.currentTime = end;
        await new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 500);
          video.addEventListener(
            "seeked",
            () => {
              window.clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });

        const started = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / (segmentDuration * 1000));
          if (now - previousFrame > 1000 / 24 || progress === 1) {
            previousFrame = now;
            video.currentTime = end - progress * segmentDuration;
          }
          if (progress >= swapPoint) swap();
          if (progress >= 1) {
            finish();
            return;
          }
          animationFrame = window.requestAnimationFrame(tick);
        };
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      video.currentTime = start;
      const trackProgress = () => {
        const progress = Math.max(0, Math.min(1, (video.currentTime - start) / segmentDuration));
        if (progress >= swapPoint) swap();
        if (video.currentTime >= end - 0.035) {
          video.pause();
          finish();
        }
      };

      video.addEventListener("timeupdate", trackProgress);
      video.addEventListener("ended", finish, { once: true });
      try {
        await video.play();
      } catch {
        window.setTimeout(finish, Math.max(500, segmentDuration * 1000));
      }

      return () => video.removeEventListener("timeupdate", trackProgress);
    };

    let cleanup: undefined | (() => void);
    const ready = () => {
      void begin().then((result) => {
        cleanup = result;
      });
    };

    if (video.readyState >= 1) ready();
    else video.addEventListener("loadedmetadata", ready, { once: true });

    return () => {
      cleanup?.();
      video.removeEventListener("loadedmetadata", ready);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [job, onFinish]);

  return (
    <div className={`${styles.filmLayer} ${job.reverse ? styles.filmLayerReverse : ""}`} aria-hidden="true">
      <video ref={ref} src={job.src} muted playsInline preload="auto" />
      <div className={styles.filmEdge} />
      <div className={styles.filmBloom} />
      <div className={styles.filmBlackout} />
    </div>
  );
}

function IntroScene({
  ready,
  onReady,
  onNavigate,
}: {
  ready: boolean;
  onReady: () => void;
  onNavigate: (scene: Scene) => void;
}) {
  return (
    <section className={`${styles.scene} ${styles.introScene}`} aria-label="Portfolio opening">
      <video
        className={styles.introFilm}
        src={`${filmRoot}/intro-master.mp4`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onReady}
        onError={onReady}
      />
      <div className={styles.introVignette} />
      <div className={`${styles.heroHotspots} ${ready ? styles.heroHotspotsVisible : ""}`}>
        <button type="button" className={styles.hotspotWork} onClick={() => onNavigate("work")} aria-label="Selected work" />
        <button type="button" className={styles.hotspotAbout} onClick={() => onNavigate("about")} aria-label="About" />
        <button type="button" className={styles.hotspotContact} onClick={() => onNavigate("contact")} aria-label="Contact" />
      </div>
      <div className={`${styles.mobileHeroNav} ${ready ? styles.mobileHeroNavVisible : ""}`}>
        <LiquidButton onClick={() => onNavigate("work")}>Work</LiquidButton>
        <LiquidButton onClick={() => onNavigate("about")}>About</LiquidButton>
        <LiquidButton onClick={() => onNavigate("contact")}>Contact</LiquidButton>
      </div>
      <button type="button" className={styles.skipIntro} onClick={onReady}>
        Enter experience
      </button>
      <div className={`${styles.scrollPrompt} ${ready ? styles.scrollPromptVisible : ""}`}>
        <span>Scroll to begin</span>
        <i />
      </div>
    </section>
  );
}

function AboutScene({ onNavigate }: { onNavigate: (scene: Scene) => void }) {
  return (
    <section className={`${styles.scene} ${styles.aboutScene}`} aria-label="About Ilan Sastiel">
      <div className={styles.aboutAtmosphere} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.aboutMark}>
        <div className={styles.aboutMarkHalo} />
        <img src="/cinematic-v3/symbol.svg" alt="Ilan Sastiel symbol" />
        <span>ILAN SASTIEL</span>
      </div>
      <div className={styles.aboutCopy}>
        <p className={styles.kicker}>About the maker · Haifa, Israel</p>
        <h1>Every project begins as one clear visual idea.</h1>
        <p className={styles.aboutLead}>
          I move between identity, print, illustration, and interface design. The medium changes, but the obsession stays
          the same: shape, rhythm, color, and a visual system people remember.
        </p>
        <div className={styles.aboutFlow}>
          <span>Identity</span>
          <i />
          <span>Editorial</span>
          <i />
          <span>Illustration</span>
          <i />
          <span>Digital</span>
        </div>
        <p className={styles.aboutSecondary}>
          This alternate cut is built from the films already created: each generated frame becomes a real interface state,
          and every project transition remains part of one continuous journey.
        </p>
        <div className={styles.aboutActions}>
          <LiquidButton onClick={() => onNavigate("work")}>Enter the work</LiquidButton>
          <LiquidButton onClick={() => onNavigate("contact")} subtle>
            Start a project
          </LiquidButton>
        </div>
      </div>
      <div className={styles.sceneIndex}>01</div>
    </section>
  );
}

function WorkScene({
  project,
  activeIndex,
  busy,
  onMove,
  onSelect,
  onOpen,
}: {
  project: Project;
  activeIndex: number;
  busy: boolean;
  onMove: (direction: 1 | -1) => void;
  onSelect: (index: number) => void;
  onOpen: () => void;
}) {
  return (
    <section className={`${styles.scene} ${styles.workScene}`} aria-label="Selected work">
      <FrozenProjectFilm project={project} />
      <div className={styles.workShade} />
      <div className={styles.workTexture} />

      <div className={styles.workCopy}>
        <p className={styles.kicker}>{project.category}</p>
        <div className={styles.workTitleLine}>
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <h1>{project.title}</h1>
        </div>
        <p>{project.description}</p>
        <div className={styles.workTags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <LiquidButton onClick={onOpen} ariaLabel={`Open ${project.title}`}>
          Enter project
        </LiquidButton>
      </div>

      <div className={styles.workControls}>
        <button type="button" onClick={() => onMove(-1)} disabled={busy} aria-label="Previous project">
          <span>Previous</span>
          <i>←</i>
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={busy} aria-label="Next project">
          <span>Next film</span>
          <i>→</i>
        </button>
      </div>

      <nav className={styles.projectTimeline} aria-label="Project film timeline">
        {projects.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === activeIndex ? styles.projectTimelineActive : ""}
            onClick={() => onSelect(index)}
            disabled={busy}
            aria-label={`Show ${item.title}`}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i />
            <em>{item.title}</em>
          </button>
        ))}
      </nav>

      <div className={styles.sceneIndex}>02</div>
    </section>
  );
}

function ContactScene({
  contact,
  status,
  onChange,
  onSubmit,
}: {
  contact: ContactForm;
  status: "idle" | "sending" | "success" | "error";
  onChange: (field: keyof ContactForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className={`${styles.scene} ${styles.contactScene}`} aria-label="Contact">
      <div className={styles.contactLiquid} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.contactIntro}>
        <p className={styles.kicker}>Final scene · Contact</p>
        <h1>Tell me what you want to bring to life.</h1>
        <p>
          A visual identity, a printed object, an interface, an illustration, or something that refuses to fit inside a
          neat category.
        </p>
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/art_and_hp/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <form className={styles.contactForm} onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input value={contact.name} onChange={(event) => onChange("name", event.target.value)} required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={contact.email} onChange={(event) => onChange("email", event.target.value)} required />
        </label>
        <label className={styles.contactWide}>
          <span>Subject</span>
          <input value={contact.subject} onChange={(event) => onChange("subject", event.target.value)} required />
        </label>
        <label className={styles.contactWide}>
          <span>Message</span>
          <textarea rows={5} value={contact.message} onChange={(event) => onChange("message", event.target.value)} required />
        </label>
        <button type="submit" className={styles.sendButton} disabled={status === "sending"}>
          <span>{status === "sending" ? "Sending" : "Send message"}</span>
          <i />
        </button>
        <p className={styles.formStatus} aria-live="polite">
          {status === "success" && "Your message is on its way."}
          {status === "error" && "The message did not send. Please try again."}
        </p>
      </form>
      <div className={styles.sceneIndex}>03</div>
    </section>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <article className={styles.caseStudy} aria-label={`${project.title} case study`}>
      <header className={styles.caseHeader}>
        <button type="button" className={styles.caseClose} onClick={onClose}>
          <span>Back to the film</span>
          <i>×</i>
        </button>
        <div className={styles.caseHeaderCopy}>
          <p className={styles.kicker}>{project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <span className={styles.caseNumber}>{String(project.id).padStart(2, "0")}</span>
      </header>

      <figure className={styles.caseHero}>
        <img src={project.detailImage} alt={`${project.title} project presentation`} />
      </figure>

      <div className={styles.caseDetails}>
        <section>
          <span>Highlights</span>
          {project.highlights.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
        <section>
          <span>Deliverables</span>
          {project.deliverables.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
        <section>
          <span>Tools</span>
          {project.tools.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
      </div>

      <div className={styles.caseTags}>
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {project.figmaUrl && (
        <a className={styles.caseExternal} href={project.figmaUrl} target="_blank" rel="noreferrer">
          Open interactive prototype
        </a>
      )}

      <footer className={styles.caseFooter}>
        <img src="/cinematic-v3/full-logo.svg" alt="Ilan Sastiel — Your design, my passion" />
        <button type="button" onClick={onClose}>
          Return to selected work
        </button>
      </footer>
    </article>
  );
}

export default function CinematicRecut() {
  const [scene, setScene] = useState<Scene>("home");
  const [introReady, setIntroReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [film, setFilm] = useState<FilmJob | null>(null);
  const [contact, setContact] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const filmId = useRef(0);
  const lastWheel = useRef(0);
  const touchStart = useRef<number | null>(null);

  const activeProject = projects[activeIndex];
  const busy = Boolean(film);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 7600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add(styles.documentClass);
    return () => document.documentElement.classList.remove(styles.documentClass);
  }, []);

  const runFilm = useCallback((job: Omit<FilmJob, "id">) => {
    filmId.current += 1;
    setFilm({ ...job, id: filmId.current });
  }, []);

  const goToScene = useCallback(
    (target: Scene) => {
      if (busy || (scene === target && !selectedProject)) return;

      const clearCase = () => setSelectedProject(null);

      if (target === "work") {
        runFilm({
          src: `${filmRoot}/home-to-work.mp4`,
          swapAt: 0.72,
          onSwap: () => {
            clearCase();
            setActiveIndex(0);
            setScene("work");
          },
        });
        return;
      }

      const genericByTarget: Record<Exclude<Scene, "work">, string> = {
        home: betweenFilm(8, 9),
        about: betweenFilm(3, 5),
        contact: betweenFilm(13, 14),
      };

      runFilm({
        src: genericByTarget[target as Exclude<Scene, "work">],
        startAt: 0.45,
        endAt: 3.55,
        reverse: target === "home",
        swapAt: 0.54,
        onSwap: () => {
          clearCase();
          setScene(target);
          if (target === "home") setIntroReady(true);
        },
      });
    },
    [busy, runFilm, scene, selectedProject],
  );

  const changeProject = useCallback(
    (targetIndex: number) => {
      if (busy) return;
      if (targetIndex < 0) {
        goToScene("about");
        return;
      }
      if (targetIndex >= projects.length) {
        goToScene("contact");
        return;
      }
      if (targetIndex === activeIndex) return;

      const current = projects[activeIndex];
      const target = projects[targetIndex];
      const isNext = targetIndex === activeIndex + 1;
      const isPrevious = targetIndex === activeIndex - 1;

      if (isNext) {
        runFilm({
          src: betweenFilm(current.id, target.id),
          swapAt: 0.52,
          onSwap: () => setActiveIndex(targetIndex),
        });
        return;
      }

      if (isPrevious) {
        runFilm({
          src: betweenFilm(target.id, current.id),
          reverse: true,
          swapAt: 0.48,
          onSwap: () => setActiveIndex(targetIndex),
        });
        return;
      }

      runFilm({
        src: projectFilm(target.id),
        swapAt: 0.3,
        onSwap: () => setActiveIndex(targetIndex),
      });
    },
    [activeIndex, busy, goToScene, runFilm],
  );

  const openProject = useCallback(() => {
    if (busy) return;
    const project = activeProject;
    runFilm({
      src: projectFilm(project.id),
      reverse: true,
      swapAt: 0.58,
      onSwap: () => {
        setSelectedProject(project);
        window.scrollTo({ top: 0, behavior: "auto" });
      },
    });
  }, [activeProject, busy, runFilm]);

  const closeProject = useCallback(() => {
    if (!selectedProject || busy) return;
    const project = selectedProject;
    runFilm({
      src: projectFilm(project.id),
      swapAt: 0.18,
      onSwap: () => {
        setSelectedProject(null);
        setScene("work");
        window.scrollTo({ top: 0, behavior: "auto" });
      },
    });
  }, [busy, runFilm, selectedProject]);

  const stepExperience = useCallback(
    (direction: 1 | -1) => {
      if (busy || selectedProject) return;
      if (scene === "home") {
        if (direction === 1) goToScene("about");
        return;
      }
      if (scene === "about") {
        goToScene(direction === 1 ? "work" : "home");
        return;
      }
      if (scene === "work") {
        changeProject(activeIndex + direction);
        return;
      }
      if (scene === "contact" && direction === -1) goToScene("work");
    },
    [activeIndex, busy, changeProject, goToScene, scene, selectedProject],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      if (selectedProject || Math.abs(event.deltaY) < 28) return;
      const now = Date.now();
      if (now - lastWheel.current < 950) return;
      lastWheel.current = now;
      stepExperience(event.deltaY > 0 ? 1 : -1);
    },
    [selectedProject, stepExperience],
  );

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStart.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (selectedProject || touchStart.current === null) return;
    const end = event.changedTouches[0]?.clientY ?? touchStart.current;
    const delta = touchStart.current - end;
    touchStart.current = null;
    if (Math.abs(delta) < 55) return;
    stepExperience(delta > 0 ? 1 : -1);
  };

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!response.ok) throw new Error("Request failed");
      setContactStatus("success");
      setContact({ name: "", email: "", subject: "", message: "" });
    } catch {
      setContactStatus("error");
    }
  };

  const sceneLabel = useMemo(() => {
    if (selectedProject) return selectedProject.title;
    if (scene === "work") return activeProject.title;
    return scene;
  }, [activeProject.title, scene, selectedProject]);

  return (
    <main
      className={`${styles.root} ${selectedProject ? styles.rootCaseOpen : ""}`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-scene={scene}
    >
      <div className={styles.fixedGrain} aria-hidden="true" />

      <header className={`${styles.topNav} ${scene !== "home" || introReady ? styles.topNavVisible : ""}`}>
        <button type="button" className={styles.navLogo} onClick={() => goToScene("home")} aria-label="Home">
          <img src="/cinematic-v3/symbol.svg" alt="" />
        </button>
        <span className={styles.navScene}>{sceneLabel}</span>
        <nav aria-label="Portfolio scenes">
          <button type="button" onClick={() => goToScene("about")} className={scene === "about" ? styles.navActive : ""}>
            About
          </button>
          <button type="button" onClick={() => goToScene("work")} className={scene === "work" ? styles.navActive : ""}>
            Work
          </button>
          <button type="button" onClick={() => goToScene("contact")} className={scene === "contact" ? styles.navActive : ""}>
            Contact
          </button>
        </nav>
      </header>

      {selectedProject ? (
        <CaseStudy project={selectedProject} onClose={closeProject} />
      ) : (
        <div className={styles.sceneViewport}>
          {scene === "home" && <IntroScene ready={introReady} onReady={() => setIntroReady(true)} onNavigate={goToScene} />}
          {scene === "about" && <AboutScene onNavigate={goToScene} />}
          {scene === "work" && (
            <WorkScene
              project={activeProject}
              activeIndex={activeIndex}
              busy={busy}
              onMove={(direction) => changeProject(activeIndex + direction)}
              onSelect={changeProject}
              onOpen={openProject}
            />
          )}
          {scene === "contact" && (
            <ContactScene
              contact={contact}
              status={contactStatus}
              onChange={(field, value) => setContact((current) => ({ ...current, [field]: value }))}
              onSubmit={submitContact}
            />
          )}
        </div>
      )}

      {!selectedProject && scene !== "home" && (
        <div className={styles.scrollRail} aria-hidden="true">
          <span>Scroll</span>
          <i />
          <em>{scene === "contact" ? "up" : "through the film"}</em>
        </div>
      )}

      {film && <FilmLayer key={film.id} job={film} onFinish={() => setFilm(null)} />}
    </main>
  );
}
