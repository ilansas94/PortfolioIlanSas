"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { LiquidNav } from "./LiquidNav";
import { FULL_LOGO_DATA_URI, SYMBOL_DATA_URI } from "./assets";
import { Project, TransitionKind, projects } from "./projects";

type Scene = "hub" | "work" | "about" | "contact" | "case";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const transitionVideo: Partial<Record<TransitionKind, string>> = {
  print: "/cinematic/transition-print.mp4",
  ui: "/cinematic/transition-ui.mp4",
};

const accentFor = (kind: TransitionKind) => {
  if (kind === "print") return ["#d40b65", "#ffd600", "#00a9c7"];
  if (kind === "ui") return ["#00abc9", "#127b94", "#e70068"];
  return ["#e10068", "#712558", "#f4ce00"];
};

function TopRail({ scene, onNavigate }: { scene: Scene; onNavigate: (next: Scene) => void }) {
  const items: Array<{ id: Scene; label: string }> = [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="top-rail" aria-label="Primary navigation">
      <button className="top-rail__mark" type="button" onClick={() => onNavigate("hub")} aria-label="Return to opening">
        <img src={SYMBOL_DATA_URI} alt="" />
      </button>
      <div className="top-rail__ink" />
      <div className="top-rail__links">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={scene === item.id ? "is-active" : ""}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ProjectOrbit({ onOpen }: { onOpen: (project: Project) => void }) {
  const [active, setActive] = useState(0);
  const [dragOrigin, setDragOrigin] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const lockRef = useRef(false);
  const count = projects.length;

  const move = (delta: number) => {
    setActive((value) => (value + delta + count) % count);
  };

  const getOffset = (index: number) => {
    let offset = index - active;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const activeProject = projects[active];
  const accent = accentFor((hovered === null ? activeProject : projects[hovered]).transition);

  return (
    <section
      className="orbit-scene"
      style={{
        "--ambient-a": accent[0],
        "--ambient-b": accent[1],
        "--ambient-c": accent[2],
      } as React.CSSProperties}
      onWheel={(event) => {
        event.preventDefault();
        if (lockRef.current) return;
        lockRef.current = true;
        move(event.deltaY > 0 || event.deltaX > 0 ? 1 : -1);
        window.setTimeout(() => {
          lockRef.current = false;
        }, 420);
      }}
      onPointerDown={(event) => {
        setDragOrigin(event.clientX);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        if (dragOrigin !== null) {
          const distance = event.clientX - dragOrigin;
          if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1);
        }
        setDragOrigin(null);
      }}
    >
      <div className="orbit-scene__mist" />
      <div className="orbit-scene__caption">
        <span>{String(active + 1).padStart(2, "0")}</span>
        <strong>{activeProject.category}</strong>
      </div>
      <div className="orbit-track" aria-live="polite">
        {projects.map((project, index) => {
          const offset = getOffset(index);
          const distance = Math.abs(offset);
          const visible = distance <= 3;
          const x = offset * 29;
          const scale = Math.max(0.55, 1 - distance * 0.17);
          const z = -distance * 220;
          const rotate = offset * -13;
          const y = distance === 0 ? 0 : 5 + distance * 2;
          return (
            <button
              type="button"
              key={project.id}
              className={`project-vessel ${offset === 0 ? "is-active" : ""}`}
              style={{
                opacity: visible ? Math.max(0.12, 1 - distance * 0.3) : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${z}px) rotateY(${rotate}deg) scale(${scale})`,
                zIndex: 20 - distance,
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => {
                setHovered(index);
                setActive(index);
              }}
              onClick={() => {
                if (offset !== 0) setActive(index);
                else onOpen(project);
              }}
              aria-label={`${project.title}, ${project.category}`}
            >
              <span className="project-vessel__media">
                <img src={project.image} alt="" draggable={false} />
                <span className="project-vessel__ink" />
              </span>
              <span className="project-vessel__meta">
                <small>{project.category}</small>
                <strong>{project.title}</strong>
                <em>{offset === 0 ? "Enter" : "Bring forward"}</em>
              </span>
            </button>
          );
        })}
      </div>
      <div className="orbit-floor" aria-hidden="true">
        <span />
      </div>
      <div className="orbit-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous project">←</button>
        <div className="orbit-controls__ticks">
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.id}
              className={index === active ? "is-active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Show ${project.title}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next project">→</button>
      </div>
    </section>
  );
}

function AboutScene({ onWork, onContact }: { onWork: () => void; onContact: () => void }) {
  return (
    <section className="about-scene">
      <div className="about-scene__ink about-scene__ink--cyan" />
      <div className="about-scene__ink about-scene__ink--magenta" />
      <figure className="about-portrait">
        <img src="/Essets/passport.jpg" alt="Ilan Sastiel" />
        <span />
      </figure>
      <div className="about-copy">
        <p className="eyebrow">Ilan Sastiel</p>
        <h1>Designer, digital artist, and visual storyteller.</h1>
        <p>
          I move between identity, print, illustration, and interface design. The common thread is a love of
          composition, color, and turning a visual idea into a complete system.
        </p>
        <p>
          My process starts by looking for the clearest shape of the idea, then building the details around it until
          the work feels both useful and unmistakably its own.
        </p>
        <div className="about-actions">
          <button type="button" onClick={onWork}>See the work</button>
          <button type="button" onClick={onContact}>Start a conversation</button>
        </div>
      </div>
      <img className="about-signature" src={FULL_LOGO_DATA_URI} alt="Ilan Sastiel — Your design, my passion" />
    </section>
  );
}

function ContactScene() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <section className="contact-scene">
      <div className="contact-scene__pool" />
      <div className="contact-intro">
        <p className="eyebrow">Contact</p>
        <h1>Tell me what you are trying to make.</h1>
        <p>A logo, a printed piece, an interface, an illustration, or something that does not fit neatly in a box.</p>
        <div className="contact-social">
          <a href="https://www.instagram.com/art_and_hp/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
      <form className="contact-form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={update} required autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" />
        </label>
        <label className="contact-form__wide">
          <span>Subject</span>
          <input name="subject" value={form.subject} onChange={update} required />
        </label>
        <label className="contact-form__wide">
          <span>Message</span>
          <textarea name="message" value={form.message} onChange={update} required rows={5} />
        </label>
        <button className="contact-form__send" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send message"}
        </button>
        <p className={`contact-form__status is-${status}`} aria-live="polite">
          {status === "success" && "Your message is on its way."}
          {status === "error" && "The message did not send. Please try again."}
        </p>
      </form>
    </section>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <article className={`case-study case-study--${project.transition}`}>
      <header className="case-study__header">
        <button type="button" className="case-study__return" onClick={onClose}>
          <span>Back to orbit</span>
        </button>
        <div>
          <small>{project.category}</small>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
      </header>
      <div className="case-study__image">
        <img src={project.detailImage} alt={`${project.title} case study`} />
      </div>
      <div className="case-study__details">
        <section>
          <small>Highlights</small>
          {project.highlights.map((item) => <p key={item}>{item}</p>)}
        </section>
        <section>
          <small>Deliverables</small>
          {project.deliverables.map((item) => <p key={item}>{item}</p>)}
        </section>
        <section>
          <small>Tools</small>
          {project.tools.map((item) => <p key={item}>{item}</p>)}
        </section>
      </div>
      {project.figmaUrl && (
        <a className="case-study__external" href={project.figmaUrl} target="_blank" rel="noreferrer">
          Open the interactive prototype
        </a>
      )}
      <footer className="case-study__footer">
        <img src={SYMBOL_DATA_URI} alt="" />
        <button type="button" onClick={onClose}>Return to the work</button>
      </footer>
    </article>
  );
}

function TransitionCurtain({ kind, leaving }: { kind: TransitionKind; leaving: boolean }) {
  const src = transitionVideo[kind];
  return (
    <div className={`transition-curtain transition-curtain--${kind} ${leaving ? "is-leaving" : ""}`}>
      {src ? <video key={src} src={src} autoPlay muted playsInline preload="auto" /> : null}
      <div className="transition-curtain__ink" />
    </div>
  );
}

export default function CinematicPortfolio() {
  const [scene, setScene] = useState<Scene>("hub");
  const [handoff, setHandoff] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introFailed, setIntroFailed] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionLeaving, setTransitionLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<number | null>(null);

  useEffect(() => {
    fallbackRef.current = window.setTimeout(() => {
      setHandoff(true);
      window.setTimeout(() => setIntroDone(true), 1100);
    }, 7800);
    return () => {
      if (fallbackRef.current) window.clearTimeout(fallbackRef.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.portfolioScene = scene;
    return () => {
      delete document.documentElement.dataset.portfolioScene;
    };
  }, [scene]);

  const navigate = (next: Scene) => {
    if (next === "case") return;
    setScene(next);
    if (next !== "case") setSelected(null);
  };

  const openProject = (project: Project) => {
    setSelected(project);
    setTransitionLeaving(false);
    setTransitioning(true);
    const delay = project.transition === "ink" ? 900 : 1850;
    window.setTimeout(() => {
      setScene("case");
      window.setTimeout(() => setTransitioning(false), 420);
    }, delay);
  };

  const closeProject = () => {
    if (!selected) return;
    setTransitionLeaving(true);
    setTransitioning(true);
    window.setTimeout(() => {
      setScene("work");
      setTransitioning(false);
      setTransitionLeaving(false);
      setSelected(null);
    }, 880);
  };

  const sceneContent = useMemo(() => {
    if (scene === "work") return <ProjectOrbit onOpen={openProject} />;
    if (scene === "about") return <AboutScene onWork={() => navigate("work")} onContact={() => navigate("contact")} />;
    if (scene === "contact") return <ContactScene />;
    if (scene === "case" && selected) return <CaseStudy project={selected} onClose={closeProject} />;
    return null;
  }, [scene, selected]);

  return (
    <main className={`cinematic-portfolio scene-${scene} ${introDone ? "intro-complete" : ""}`}>
      <div className="world-background" aria-hidden="true">
        <span className="world-background__cyan" />
        <span className="world-background__magenta" />
        <span className="world-background__yellow" />
        <span className="world-background__grain" />
      </div>

      {!introDone && (
        <div className={`opening-film ${handoff ? "is-handoff" : ""} ${introFailed ? "is-fallback" : ""}`}>
          <video
            ref={videoRef}
            src="/cinematic/intro-formation.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => {
              event.currentTarget.play().catch(() => setIntroFailed(true));
            }}
            onTimeUpdate={(event) => {
              const element = event.currentTarget;
              if (element.duration && element.currentTime > element.duration - 0.95) setHandoff(true);
            }}
            onEnded={() => {
              setHandoff(true);
              window.setTimeout(() => setIntroDone(true), 120);
            }}
            onError={() => {
              setIntroFailed(true);
              window.setTimeout(() => setHandoff(true), 900);
              window.setTimeout(() => setIntroDone(true), 2600);
            }}
          />
        </div>
      )}

      <div className={`hub-stage ${scene === "hub" ? "is-current" : ""}`}>
        <img className="hub-symbol" src={SYMBOL_DATA_URI} alt="Ilan Sastiel symbol" />
        <LiquidNav
          visible={(handoff || introDone) && scene === "hub"}
          interactive={introDone && scene === "hub"}
          onSelect={(destination) => navigate(destination)}
        />
      </div>

      {introDone && <TopRail scene={scene} onNavigate={navigate} />}
      <div className={`scene-layer ${scene !== "hub" ? "is-visible" : ""}`}>{sceneContent}</div>

      {transitioning && selected && <TransitionCurtain kind={selected.transition} leaving={transitionLeaving} />}
      <div className="cursor-light" aria-hidden="true" />
    </main>
  );
}
