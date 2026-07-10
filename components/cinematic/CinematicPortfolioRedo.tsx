"use client";

import React, { useEffect, useRef, useState } from "react";
import { LiquidNav } from "./LiquidNav";
import { FULL_LOGO_DATA_URI, SYMBOL_DATA_URI } from "./assets";
import { Project, TransitionKind, projects } from "./projects";

type Mode = "journey" | "about" | "contact" | "case";
type NavTarget = "home" | "work" | "about" | "contact";
type ContactForm = { name: string; email: string; subject: string; message: string };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const projectVideo = (project: Project) => `/cinematic/project-${project.id}.mp4`;

function TopRail({ active, onNavigate }: { active: NavTarget; onNavigate: (target: NavTarget) => void }) {
  return (
    <nav className="top-rail top-rail--redo" aria-label="Primary navigation">
      <button className="top-rail__mark" type="button" onClick={() => onNavigate("home")} aria-label="Return to opening">
        <img src={SYMBOL_DATA_URI} alt="" />
      </button>
      <div className="top-rail__ink" />
      <div className="top-rail__links">
        {(["work", "about", "contact"] as const).map((item) => (
          <button key={item} type="button" className={active === item ? "is-active" : ""} onClick={() => onNavigate(item)}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ProjectLiveFrame({ project, progress, onOpen }: { project: Project; progress: number; onOpen: (project: Project) => void }) {
  const reveal = clamp((progress - 0.7) / 0.24);
  const ready = reveal > 0.82;
  return (
    <button
      type="button"
      className={`project-live-frame project-live-frame--${project.transition} ${ready ? "is-ready" : ""}`}
      style={{ "--project-reveal": reveal } as React.CSSProperties}
      onClick={() => ready && onOpen(project)}
      disabled={!ready}
      aria-label={`Open ${project.title}`}
    >
      <span className="project-live-frame__aperture">
        <img src={project.image} alt="" draggable={false} />
        <span className="project-live-frame__wash" />
        <span className="project-live-frame__glass" />
      </span>
      <span className="project-live-frame__index">{String(projects.indexOf(project) + 1).padStart(2, "0")}</span>
      <span className="project-live-frame__copy">
        <small>{project.category}</small>
        <strong>{project.title}</strong>
        <em>{ready ? "Enter project" : "Keep scrolling"}</em>
      </span>
      <span className="project-live-frame__enter" aria-hidden="true">↗</span>
    </button>
  );
}

function WorkScrollStory({ onOpen }: { onOpen: (project: Project) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bridgeVideoRef = useRef<HTMLVideoElement>(null);
  const projectVideoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [bridgeProgress, setBridgeProgress] = useState(0);
  const [bridgeMissing, setBridgeMissing] = useState(false);
  const [projectMissing, setProjectMissing] = useState(false);
  const activeProject = projects[activeIndex];
  const units = projects.length + 1;

  useEffect(() => {
    setProjectMissing(false);
  }, [activeIndex]);

  useEffect(() => {
    const syncVideo = (video: HTMLVideoElement | null, progress: number) => {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const target = clamp(progress) * Math.max(0.01, video.duration - 0.04);
      if (Math.abs(video.currentTime - target) > 0.025) video.currentTime = target;
    };

    syncVideo(bridgeVideoRef.current, bridgeProgress);
    syncVideo(projectVideoRef.current, localProgress);
  }, [bridgeProgress, localProgress, activeIndex]);

  useEffect(() => {
    const update = () => {
      rafRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const normalized = clamp(-rect.top / range);
      const raw = normalized * units;

      if (raw < 1) {
        setBridgeProgress(clamp(raw));
        setActiveIndex(0);
        setLocalProgress(0);
        return;
      }

      const projectRaw = Math.min(projects.length - 0.0001, raw - 1);
      const index = Math.min(projects.length - 1, Math.floor(projectRaw));
      setBridgeProgress(1);
      setActiveIndex(index);
      setLocalProgress(clamp(projectRaw - index));
    };

    const schedule = () => {
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [units]);

  const bridgeLiveReveal = clamp((bridgeProgress - 0.76) / 0.22);
  const movieOpacity = 1 - clamp((localProgress - 0.76) / 0.2);

  return (
    <section
      id="work-story"
      ref={sectionRef}
      className="work-scroll-story"
      style={{ "--story-units": units } as React.CSSProperties}
      aria-label="Selected work — scroll-controlled cinematic sequence"
    >
      <div className="work-scroll-sticky">
        <div className={`home-work-bridge ${bridgeProgress < 1 ? "is-active" : ""}`} style={{ "--bridge-progress": bridgeProgress } as React.CSSProperties}>
          {!bridgeMissing && (
            <video
              ref={bridgeVideoRef}
              src="/cinematic/home-to-work.mp4"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                event.currentTarget.pause();
                event.currentTarget.currentTime = 0;
              }}
              onError={() => setBridgeMissing(true)}
            />
          )}
          <div className="home-work-bridge__fallback" aria-hidden="true">
            <span className="home-work-bridge__drop home-work-bridge__drop--one" />
            <span className="home-work-bridge__drop home-work-bridge__drop--two" />
            <span className="home-work-bridge__drop home-work-bridge__drop--three" />
            <span className="home-work-bridge__portal" />
          </div>
          <div className="home-work-bridge__copy">
            <small>Selected worlds</small>
            <strong>Scroll is the timeline.</strong>
            <span>Move down or back up to control every frame.</span>
          </div>
          <div className="home-work-bridge__first" style={{ opacity: bridgeLiveReveal }}>
            <ProjectLiveFrame project={projects[0]} progress={0.7 + bridgeLiveReveal * 0.3} onOpen={onOpen} />
          </div>
        </div>

        <div className={`project-scroll-film ${bridgeProgress >= 1 ? "is-active" : ""}`} style={{ "--film-progress": localProgress } as React.CSSProperties}>
          <div className={`project-scroll-film__movie ${projectMissing ? "is-missing" : ""}`} style={{ opacity: movieOpacity }}>
            {!projectMissing && (
              <video
                key={activeProject.id}
                ref={projectVideoRef}
                src={projectVideo(activeProject)}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={(event) => {
                  event.currentTarget.pause();
                  event.currentTarget.currentTime = localProgress * Math.max(0.01, event.currentTarget.duration - 0.04);
                }}
                onError={() => setProjectMissing(true)}
              />
            )}
            <div className={`project-scroll-film__procedural project-scroll-film__procedural--${activeProject.transition}`} aria-hidden="true">
              <span className="project-scroll-film__ink project-scroll-film__ink--a" />
              <span className="project-scroll-film__ink project-scroll-film__ink--b" />
              <span className="project-scroll-film__ink project-scroll-film__ink--c" />
              <span className="project-scroll-film__image-ghost"><img src={activeProject.image} alt="" /></span>
            </div>
          </div>

          <ProjectLiveFrame project={activeProject} progress={localProgress} onOpen={onOpen} />

          <div className="project-scroll-film__counter" aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(projects.length).padStart(2, "0")}</span>
          </div>
          <div className="project-scroll-film__timeline" aria-hidden="true">
            {projects.map((project, index) => <span key={project.id} className={index === activeIndex ? "is-current" : index < activeIndex ? "is-past" : ""} />)}
          </div>
          <p className="project-scroll-film__instruction">Scroll to scrub · reverse direction to rewind</p>
        </div>
      </div>
    </section>
  );
}

function AboutScene({ onWork, onContact }: { onWork: () => void; onContact: () => void }) {
  return (
    <section className="about-scene">
      <div className="about-scene__ink about-scene__ink--cyan" />
      <div className="about-scene__ink about-scene__ink--magenta" />
      <figure className="about-portrait"><img src="/Essets/passport.jpg" alt="Ilan Sastiel" /><span /></figure>
      <div className="about-copy">
        <p className="eyebrow">Ilan Sastiel</p>
        <h1>Designer, digital artist, and visual storyteller.</h1>
        <p>I move between identity, print, illustration, and interface design. The common thread is a love of composition, color, and turning a visual idea into a complete system.</p>
        <p>My process starts by looking for the clearest shape of the idea, then building the details around it until the work feels both useful and unmistakably its own.</p>
        <div className="about-actions"><button type="button" onClick={onWork}>Enter the sequence</button><button type="button" onClick={onContact}>Start a conversation</button></div>
      </div>
      <img className="about-signature" src={FULL_LOGO_DATA_URI} alt="Ilan Sastiel — Your design, my passion" />
    </section>
  );
}

function ContactScene() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };
  return (
    <section className="contact-scene">
      <div className="contact-scene__pool" />
      <div className="contact-intro"><p className="eyebrow">Contact</p><h1>Tell me what you are trying to make.</h1><p>A logo, a printed piece, an interface, an illustration, or something that does not fit neatly in a box.</p><div className="contact-social"><a href="https://www.instagram.com/art_and_hp/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL" target="_blank" rel="noreferrer">Facebook</a></div></div>
      <form className="contact-form" onSubmit={submit}>
        <label><span>Name</span><input name="name" value={form.name} onChange={update} required autoComplete="name" /></label>
        <label><span>Email</span><input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" /></label>
        <label className="contact-form__wide"><span>Subject</span><input name="subject" value={form.subject} onChange={update} required /></label>
        <label className="contact-form__wide"><span>Message</span><textarea name="message" value={form.message} onChange={update} required rows={5} /></label>
        <button className="contact-form__send" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send message"}</button>
        <p className={`contact-form__status is-${status}`} aria-live="polite">{status === "success" && "Your message is on its way."}{status === "error" && "The message did not send. Please try again."}</p>
      </form>
    </section>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <article className={`case-study case-study--${project.transition}`}>
      <header className="case-study__header">
        <button type="button" className="case-study__return" onClick={onClose}><span>Back to sequence</span></button>
        <div><small>{project.category}</small><h1>{project.title}</h1><p>{project.description}</p></div>
      </header>
      <div className="case-study__image"><img src={project.detailImage} alt={`${project.title} case study`} /></div>
      <div className="case-study__details">
        <section><small>Highlights</small>{project.highlights.map((item) => <p key={item}>{item}</p>)}</section>
        <section><small>Deliverables</small>{project.deliverables.map((item) => <p key={item}>{item}</p>)}</section>
        <section><small>Tools</small>{project.tools.map((item) => <p key={item}>{item}</p>)}</section>
      </div>
      {project.figmaUrl && <a className="case-study__external" href={project.figmaUrl} target="_blank" rel="noreferrer">Open the interactive prototype</a>}
      <footer className="case-study__footer"><img src={SYMBOL_DATA_URI} alt="" /><button type="button" onClick={onClose}>Return to the sequence</button></footer>
    </article>
  );
}

function ProjectDive({ project, direction }: { project: Project; direction: "in" | "out" }) {
  return (
    <div className={`project-dive project-dive--${project.transition} is-${direction}`} aria-hidden="true">
      <span className="project-dive__field" />
      <div className="project-dive__frame"><img src={project.image} alt="" /><span /></div>
      <strong>{project.title}</strong>
    </div>
  );
}

export default function CinematicPortfolio() {
  const [mode, setMode] = useState<Mode>("journey");
  const [handoff, setHandoff] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introFailed, setIntroFailed] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [dive, setDive] = useState<"in" | "out" | null>(null);
  const [journeyZone, setJourneyZone] = useState<"home" | "work">("home");
  const fallbackRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.portfolioScene = mode;
    return () => { delete document.documentElement.dataset.portfolioScene; };
  }, [mode]);

  useEffect(() => {
    fallbackRef.current = window.setTimeout(() => {
      setHandoff(true);
      window.setTimeout(() => setIntroDone(true), 1100);
    }, 7800);
    return () => { if (fallbackRef.current) window.clearTimeout(fallbackRef.current); };
  }, []);

  useEffect(() => {
    const updateZone = () => setJourneyZone(window.scrollY > window.innerHeight * 0.58 ? "work" : "home");
    updateZone();
    window.addEventListener("scroll", updateZone, { passive: true });
    return () => window.removeEventListener("scroll", updateZone);
  }, []);

  const goTo = (target: NavTarget) => {
    if (target === "about" || target === "contact") {
      setMode(target);
      return;
    }
    setMode("journey");
    window.requestAnimationFrame(() => {
      if (target === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.getElementById("work-story")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openProject = (project: Project) => {
    if (dive) return;
    setSelected(project);
    setDive("in");
    window.setTimeout(() => {
      setMode("case");
      setDive(null);
    }, 880);
  };

  const closeProject = () => {
    if (!selected || dive) return;
    setDive("out");
    window.setTimeout(() => {
      setMode("journey");
      setDive(null);
      setSelected(null);
    }, 820);
  };

  const activeNav: NavTarget = mode === "about" ? "about" : mode === "contact" ? "contact" : journeyZone;

  return (
    <main className={`cinematic-portfolio cinematic-portfolio--redo mode-${mode} ${introDone ? "intro-complete" : ""}`}>
      <div className="world-background" aria-hidden="true"><span className="world-background__cyan" /><span className="world-background__magenta" /><span className="world-background__yellow" /><span className="world-background__grain" /></div>

      <div className={`journey-shell ${mode === "journey" ? "is-current" : ""}`} aria-hidden={mode !== "journey"}>
        <section className="scroll-hub" aria-label="Portfolio opening">
          {!introDone && (
            <div className={`opening-film ${handoff ? "is-handoff" : ""} ${introFailed ? "is-fallback" : ""}`}>
              <video
                src="/cinematic/intro-formation.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={(event) => event.currentTarget.play().catch(() => setIntroFailed(true))}
                onTimeUpdate={(event) => { const video = event.currentTarget; if (video.duration && video.currentTime > video.duration - 0.98) setHandoff(true); }}
                onEnded={() => { setHandoff(true); window.setTimeout(() => setIntroDone(true), 940); }}
                onError={() => { setIntroFailed(true); window.setTimeout(() => setHandoff(true), 700); window.setTimeout(() => setIntroDone(true), 2300); }}
              />
            </div>
          )}
          <div className="hub-stage hub-stage--redo is-current">
            <img className="hub-symbol" src={SYMBOL_DATA_URI} alt="Ilan Sastiel symbol" />
            <LiquidNav visible={handoff || introDone} interactive={introDone && mode === "journey"} onSelect={(destination) => goTo(destination)} />
          </div>
          <button className="hub-scroll-cue" type="button" onClick={() => goTo("work")} tabIndex={introDone ? 0 : -1}>
            <span>Scroll to enter the work</span><i />
          </button>
        </section>
        <WorkScrollStory onOpen={openProject} />
      </div>

      {introDone && <TopRail active={activeNav} onNavigate={goTo} />}
      {mode === "about" && <div className="scene-overlay is-visible"><AboutScene onWork={() => goTo("work")} onContact={() => goTo("contact")} /></div>}
      {mode === "contact" && <div className="scene-overlay is-visible"><ContactScene /></div>}
      {mode === "case" && selected && <div className="scene-overlay scene-overlay--case is-visible"><CaseStudy project={selected} onClose={closeProject} /></div>}
      {selected && dive && <ProjectDive project={selected} direction={dive} />}
      <div className="cursor-light" aria-hidden="true" />
    </main>
  );
}
