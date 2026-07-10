"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CinematicPortfolio.module.css";

type TransitionKind = "print" | "ink" | "ui";
type SectionId = "home" | "about" | "work" | "contact";

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
  transition: TransitionKind;
  figmaUrl?: string;
};

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type TransitionState = {
  id: number;
  kind: TransitionKind;
  reverse: boolean;
} | null;

const projects: Project[] = [
  {
    id: 2,
    title: "Company Redesign",
    category: "Brand identity",
    description:
      "A playful identity for a youth initiative, built around a celebratory splash mark, a bilingual wordmark, and a flexible color system.",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    tags: ["Branding", "Logo design", "Identity"],
    highlights: ["Bilingual identity system", "Energetic CMYK-led palette", "Flexible event applications"],
    deliverables: ["Primary and secondary marks", "Stationery and social templates", "Event collateral"],
    tools: ["Illustrator", "Photoshop"],
    transition: "print",
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
    transition: "print",
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
    transition: "ink",
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
    transition: "print",
  },
  {
    id: 8,
    title: "Keren Nails",
    category: "Logo design",
    description:
      "A clean, feminine mark balanced for signage, appointment cards, social profiles, and small-format reproduction.",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    tags: ["Logo", "Beauty", "Branding"],
    highlights: ["Soft curves", "Small-size clarity", "Restrained color system"],
    deliverables: ["Logo files", "Card and sign layouts"],
    tools: ["Illustrator"],
    transition: "ink",
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
    transition: "ui",
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
    transition: "ui",
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
    transition: "ink",
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
    transition: "ui",
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
    transition: "print",
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
    transition: "ink",
  },
];

const transitionVideos: Record<TransitionKind, string> = {
  print: "/cinematic-v3/transition-print.mp4",
  ink: "/cinematic-v3/transition-ink.mp4",
  ui: "/cinematic-v3/transition-ui.mp4",
};

function LiquidButton({
  children,
  onClick,
  active = false,
  compact = false,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  compact?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.liquidButton} ${active ? styles.liquidButtonActive : ""} ${compact ? styles.liquidButtonCompact : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className={styles.liquidButtonBody}>
        <span className={styles.liquidButtonText}>{children}</span>
        <span className={`${styles.buttonDrop} ${styles.buttonDropOne}`} />
        <span className={`${styles.buttonDrop} ${styles.buttonDropTwo}`} />
        <span className={`${styles.buttonDrop} ${styles.buttonDropThree}`} />
      </span>
    </button>
  );
}

function VideoPortal({
  video,
  eyebrow,
  title,
  copy,
}: {
  video: string;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.currentTime = 0;
          element.play().catch(() => undefined);
        } else {
          element.pause();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.videoPortal} aria-label={title}>
      <video ref={ref} src={video} muted playsInline preload="metadata" />
      <div className={styles.videoPortalFallback} />
      <div className={styles.videoPortalShade} />
      <div className={styles.videoPortalCopy}>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </section>
  );
}

function CinematicTransition({ state }: { state: TransitionState }) {
  if (!state) return null;
  return (
    <div
      key={state.id}
      className={`${styles.transitionCurtain} ${state.reverse ? styles.transitionCurtainReverse : ""}`}
      aria-hidden="true"
    >
      <video src={transitionVideos[state.kind]} autoPlay muted playsInline preload="auto" />
      <div className={`${styles.transitionFallback} ${styles[`transitionFallback${state.kind}`]}`} />
      <div className={styles.transitionBloom} />
    </div>
  );
}

function ProjectCase({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <article className={styles.caseStudy} aria-label={`${project.title} case study`}>
      <div className={styles.caseStudyAmbient} data-kind={project.transition} />
      <header className={styles.caseHeader}>
        <button type="button" className={styles.caseBack} onClick={onClose}>
          <span>Back to the film</span>
        </button>
        <div className={styles.caseHeaderCopy}>
          <span>{project.category}</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <div className={styles.caseHeaderIndex}>{String(project.id).padStart(2, "0")}</div>
      </header>

      <figure className={styles.caseHeroImage}>
        <img src={project.detailImage} alt={`${project.title} project`} />
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
        <a href={project.figmaUrl} target="_blank" rel="noreferrer" className={styles.caseExternal}>
          Open interactive prototype
        </a>
      )}

      <footer className={styles.caseFooter}>
        <img src="/cinematic-v3/symbol.svg" alt="" />
        <button type="button" onClick={onClose}>
          Return to selected work
        </button>
      </footer>
    </article>
  );
}

export default function CinematicPortfolioV3() {
  const [introReady, setIntroReady] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [activeProject, setActiveProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [transition, setTransition] = useState<TransitionState>(null);
  const [contact, setContact] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [pointer, setPointer] = useState({ x: -200, y: -200 });
  const transitionId = useRef(0);
  const transitionTimers = useRef<number[]>([]);

  const currentProject = projects[activeProject];

  const clearTransitionTimers = useCallback(() => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 7200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => setPointer({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-cinematic-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionId);
      },
      { threshold: [0.25, 0.5, 0.72] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add(styles.documentClass);
    return () => document.documentElement.classList.remove(styles.documentClass);
  }, []);

  useEffect(() => {
    return () => clearTransitionTimers();
  }, [clearTransitionTimers]);

  const playTransition = useCallback(
    (kind: TransitionKind, action: () => void, reverse = false) => {
      clearTransitionTimers();
      transitionId.current += 1;
      setTransition({ id: transitionId.current, kind, reverse });
      const actionTimer = window.setTimeout(action, reverse ? 620 : 820);
      const finishTimer = window.setTimeout(() => setTransition(null), reverse ? 1500 : 1900);
      transitionTimers.current = [actionTimer, finishTimer];
    },
    [clearTransitionTimers],
  );

  const navigateTo = useCallback(
    (section: SectionId) => {
      if (selectedProject) {
        playTransition(selectedProject.transition, () => {
          setSelectedProject(null);
          document.getElementById(section)?.scrollIntoView({ behavior: "auto", block: "start" });
        }, true);
        return;
      }
      const kind: TransitionKind = section === "work" ? "print" : section === "contact" ? "ui" : "ink";
      playTransition(kind, () => {
        document.getElementById(section)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    },
    [playTransition, selectedProject],
  );

  const openProject = useCallback(
    (project: Project) => {
      playTransition(project.transition, () => {
        setSelectedProject(project);
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [playTransition],
  );

  const closeProject = useCallback(() => {
    if (!selectedProject) return;
    playTransition(
      selectedProject.transition,
      () => {
        setSelectedProject(null);
        window.setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "auto" }), 0);
      },
      true,
    );
  }, [playTransition, selectedProject]);

  const moveProject = useCallback((delta: number) => {
    setActiveProject((current) => (current + delta + projects.length) % projects.length);
  }, []);

  const projectOffset = useCallback(
    (index: number) => {
      let offset = index - activeProject;
      if (offset > projects.length / 2) offset -= projects.length;
      if (offset < -projects.length / 2) offset += projects.length;
      return offset;
    },
    [activeProject],
  );

  const submitContact = async (event: React.FormEvent) => {
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

  const activeAccent = useMemo(() => {
    if (currentProject.transition === "ui") return "cyan";
    if (currentProject.transition === "ink") return "magenta";
    return "yellow";
  }, [currentProject.transition]);

  if (selectedProject) {
    return (
      <main className={styles.root}>
        <svg className={styles.gooFilter} aria-hidden="true">
          <defs>
            <filter id="cinematic-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <ProjectCase project={selectedProject} onClose={closeProject} />
        <CinematicTransition state={transition} />
        <div className={styles.pointerGlow} style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }} />
      </main>
    );
  }

  return (
    <main className={styles.root} data-accent={activeAccent}>
      <svg className={styles.gooFilter} aria-hidden="true">
        <defs>
          <filter id="cinematic-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className={styles.fixedAtmosphere} aria-hidden="true">
        <span className={styles.atmosphereCyan} />
        <span className={styles.atmosphereMagenta} />
        <span className={styles.atmosphereYellow} />
        <span className={styles.atmosphereGrain} />
      </div>

      <header className={`${styles.topRail} ${introReady ? styles.topRailVisible : ""}`}>
        <button type="button" className={styles.topRailLogo} onClick={() => navigateTo("home")} aria-label="Home">
          <img src="/cinematic-v3/symbol.svg" alt="Ilan Sastiel" />
        </button>
        <div className={styles.topRailLine} />
        <nav aria-label="Portfolio sections">
          {(["about", "work", "contact"] as SectionId[]).map((section) => (
            <button
              type="button"
              key={section}
              className={activeSection === section ? styles.topRailActive : ""}
              onClick={() => navigateTo(section)}
            >
              {section}
            </button>
          ))}
        </nav>
      </header>

      <section id="home" data-cinematic-section className={styles.hero}>
        <video
          className={styles.heroFilm}
          src="/cinematic-v3/intro.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (video.duration && video.currentTime >= video.duration - 1.05) setIntroReady(true);
          }}
          onEnded={() => setIntroReady(true)}
          onError={() => setIntroReady(true)}
        />
        <div className={styles.heroFilmFallback} />
        <div className={styles.heroVignette} />

        <div className={`${styles.heroLogoStage} ${introReady ? styles.heroLogoStageReady : ""}`}>
          <div className={styles.heroLogoHalo} />
          <img src="/cinematic-v3/symbol.svg" alt="Ilan Sastiel symbol" className={styles.heroSymbol} />
          <div className={styles.heroIdentity}>
            <span>ILAN SASTIEL</span>
            <p>Graphic designer · visual storyteller</p>
          </div>
        </div>

        <div className={`${styles.heroNavigation} ${introReady ? styles.heroNavigationVisible : ""}`}>
          <LiquidButton onClick={() => navigateTo("work")}>Work</LiquidButton>
          <LiquidButton onClick={() => navigateTo("about")}>About</LiquidButton>
          <LiquidButton onClick={() => navigateTo("contact")}>Contact</LiquidButton>
        </div>

        <button type="button" className={styles.skipFilm} onClick={() => setIntroReady(true)}>
          Enter experience
        </button>

        <div className={`${styles.scrollCue} ${introReady ? styles.scrollCueVisible : ""}`}>
          <span>Scroll into the film</span>
          <i />
        </div>
      </section>

      <section id="about" data-cinematic-section className={styles.aboutScene}>
        <div className={styles.sceneNumber}>01</div>
        <div className={styles.aboutPortraitFrame}>
          <div className={styles.aboutPortraitLiquid} />
          <img src="/Essets/passport.jpg" alt="Ilan Sastiel" />
          <span>Haifa · Israel</span>
        </div>
        <div className={styles.aboutCopy}>
          <p className={styles.eyebrow}>About the maker</p>
          <h1>I turn a visual idea into a complete world.</h1>
          <p className={styles.aboutLead}>
            I move between identity, print, illustration, and interface design. The medium changes; the obsession with
            shape, rhythm, color, and a memorable visual system stays the same.
          </p>
          <div className={styles.aboutColumns}>
            <p>
              My process starts by finding the clearest form of an idea. Then I build the details around it until every
              screen, page, object, and transition feels like part of the same thought.
            </p>
            <p>
              This portfolio is designed the same way: not as a grid of thumbnails, but as one continuous piece of visual
              storytelling.
            </p>
          </div>
          <div className={styles.aboutActions}>
            <LiquidButton compact onClick={() => navigateTo("work")}>Selected work</LiquidButton>
            <LiquidButton compact onClick={() => navigateTo("contact")}>Start a project</LiquidButton>
          </div>
        </div>
      </section>

      <VideoPortal
        video="/cinematic-v3/transition-print.mp4"
        eyebrow="Scene change · Runway film"
        title="The image breaks into ink. The work comes through."
        copy="A full-frame transition connects the personal story to the project world without returning to a conventional webpage."
      />

      <section id="work" data-cinematic-section className={styles.workScene}>
        <div className={styles.sceneNumber}>02</div>
        <header className={styles.workHeader}>
          <p className={styles.eyebrow}>Selected work</p>
          <h1>A moving constellation of projects.</h1>
          <p>Drag, scroll, or use the liquid controls. The active piece opens through its own cinematic transition.</p>
        </header>

        <div
          className={styles.projectWorld}
          onWheel={(event) => {
            if (Math.abs(event.deltaY) < 10 && Math.abs(event.deltaX) < 10) return;
            moveProject(event.deltaY > 0 || event.deltaX > 0 ? 1 : -1);
          }}
        >
          <div className={styles.projectAmbient} />
          {projects.map((project, index) => {
            const offset = projectOffset(index);
            const distance = Math.abs(offset);
            const visible = distance <= 2;
            return (
              <button
                type="button"
                key={project.id}
                className={`${styles.projectCard} ${offset === 0 ? styles.projectCardActive : ""}`}
                style={{
                  "--project-x": `${offset * 32}vw`,
                  "--project-z": `${-distance * 260}px`,
                  "--project-rotate": `${offset * -12}deg`,
                  "--project-scale": `${Math.max(0.58, 1 - distance * 0.19)}`,
                  opacity: visible ? Math.max(0.18, 1 - distance * 0.34) : 0,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: 20 - distance,
                } as React.CSSProperties}
                onClick={() => (offset === 0 ? openProject(project) : setActiveProject(index))}
                aria-label={`${project.title}, ${project.category}`}
              >
                <span className={styles.projectMedia}>
                  <img src={project.image} alt="" draggable={false} />
                  <span className={styles.projectMediaGlass} />
                  <span className={styles.projectMediaInk} data-kind={project.transition} />
                </span>
                <span className={styles.projectMeta}>
                  <small>{project.category}</small>
                  <strong>{project.title}</strong>
                  <em>{offset === 0 ? "Enter project" : "Bring forward"}</em>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.projectControls}>
          <LiquidButton compact onClick={() => moveProject(-1)} ariaLabel="Previous project">←</LiquidButton>
          <div className={styles.projectCounter}>
            <span>{String(activeProject + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(projects.length).padStart(2, "0")}</span>
          </div>
          <LiquidButton compact onClick={() => moveProject(1)} ariaLabel="Next project">→</LiquidButton>
        </div>

        <div className={styles.projectRail}>
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.id}
              className={index === activeProject ? styles.projectRailActive : ""}
              onClick={() => setActiveProject(index)}
              aria-label={`Show ${project.title}`}
            />
          ))}
        </div>
      </section>

      <VideoPortal
        video="/cinematic-v3/transition-ui.mp4"
        eyebrow="Scene change · Runway film"
        title="The project world liquefies into a direct conversation."
        copy="The interface does not cut to a contact page. It reforms as the final scene of the same visual system."
      />

      <section id="contact" data-cinematic-section className={styles.contactScene}>
        <div className={styles.sceneNumber}>03</div>
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>Contact</p>
          <h1>Tell me what you want to bring to life.</h1>
          <p>
            A visual identity, a printed object, an interface, an illustration, or something that refuses to fit neatly
            inside a category.
          </p>
          <div className={styles.contactLinks}>
            <a href="https://www.instagram.com/art_and_hp/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>

        <form className={styles.contactForm} onSubmit={submitContact}>
          <label>
            <span>Name</span>
            <input
              name="name"
              required
              autoComplete="name"
              value={contact.name}
              onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={contact.email}
              onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className={styles.contactWide}>
            <span>Subject</span>
            <input
              name="subject"
              required
              value={contact.subject}
              onChange={(event) => setContact((current) => ({ ...current, subject: event.target.value }))}
            />
          </label>
          <label className={styles.contactWide}>
            <span>Message</span>
            <textarea
              name="message"
              required
              rows={5}
              value={contact.message}
              onChange={(event) => setContact((current) => ({ ...current, message: event.target.value }))}
            />
          </label>
          <button type="submit" className={styles.contactSend} disabled={contactStatus === "sending"}>
            <span>{contactStatus === "sending" ? "Sending" : "Send message"}</span>
          </button>
          <p className={styles.contactStatus} aria-live="polite">
            {contactStatus === "success" && "Your message is on its way."}
            {contactStatus === "error" && "The message did not send. Please try again."}
          </p>
        </form>
      </section>

      <footer className={styles.footer}>
        <img src="/cinematic-v3/full-logo.svg" alt="Ilan Sastiel — Your design, my passion" />
        <span>© {new Date().getFullYear()} Ilan Sastiel</span>
        <button type="button" onClick={() => navigateTo("home")}>Return to opening</button>
      </footer>

      <CinematicTransition state={transition} />
      <div className={styles.pointerGlow} style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }} />
    </main>
  );
}
