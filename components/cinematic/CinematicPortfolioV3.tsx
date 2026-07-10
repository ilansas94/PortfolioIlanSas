"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FULL_LOGO_DATA_URI, SYMBOL_DATA_URI } from "./assets";
import { Project, projects } from "./projects";

type Mode = "journey" | "about" | "contact" | "case";
type NavTarget = "home" | "work" | "about" | "contact";
type ContactForm = { name: string; email: string; subject: string; message: string };
type PinState = "before" | "active" | "after";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const pad = (value: number) => String(value).padStart(2, "0");

const transitionVideo = (index: number) => {
  const target = projects[index];
  if (index === 0) return `/cinematic/transitions/home-to-${target.id}.mp4`;
  return `/cinematic/transitions/${projects[index - 1].id}-to-${target.id}.mp4`;
};

function TopRail({ active, onNavigate }: { active: NavTarget; onNavigate: (target: NavTarget) => void }) {
  return (
    <nav className="v3-rail" aria-label="Primary navigation">
      <button className="v3-rail__mark" type="button" onClick={() => onNavigate("home")} aria-label="Return to opening">
        <img src={SYMBOL_DATA_URI} alt="" />
      </button>
      <div className="v3-rail__line" />
      <div className="v3-rail__links">
        {(["work", "about", "contact"] as const).map((item) => (
          <button key={item} type="button" className={active === item ? "is-active" : ""} onClick={() => onNavigate(item)}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

function HubStage({ visible, interactive, onSelect }: { visible: boolean; interactive: boolean; onSelect: (target: "work" | "about" | "contact") => void }) {
  const items = [
    { key: "work" as const, title: "Work", note: "Selected worlds", asset: "/cinematic/hub/blob-work.svg" },
    { key: "about" as const, title: "About", note: "Profile", asset: "/cinematic/hub/blob-about.svg" },
    { key: "contact" as const, title: "Contact", note: "Begin a project", asset: "/cinematic/hub/blob-contact.svg" },
  ];

  return (
    <div className={`v3-hub ${visible ? "is-visible" : ""} ${interactive ? "is-interactive" : ""}`} aria-hidden={!visible}>
      <svg className="v3-hub__threads" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M960 520L475 650" />
        <path d="M960 520L1455 355" />
        <path d="M960 520L1460 755" />
      </svg>
      <img className="v3-hub__symbol" src={SYMBOL_DATA_URI} alt="Ilan Sastiel symbol" />
      {items.map((item) => (
        <button
          key={item.key}
          className={`v3-hub__button v3-hub__button--${item.key}`}
          type="button"
          tabIndex={interactive ? 0 : -1}
          disabled={!interactive}
          onClick={() => onSelect(item.key)}
        >
          <img src={item.asset} alt="" draggable={false} />
          <span><strong>{item.title}</strong><small>{item.note}</small></span>
        </button>
      ))}
    </div>
  );
}

function ProjectLiveFrame({ project, index, reveal, onOpen }: { project: Project; index: number; reveal: number; onOpen: (project: Project) => void }) {
  const ready = reveal > 0.985;
  return (
    <button
      type="button"
      className={`v3-project-frame v3-project-frame--${project.transition} ${ready ? "is-ready" : ""}`}
      style={{ "--v3-reveal": reveal } as React.CSSProperties}
      onClick={() => ready && onOpen(project)}
      disabled={!ready}
      aria-label={`Open ${project.title}`}
    >
      <span className="v3-project-frame__media">
        <img src={project.image} alt="" draggable={false} />
        <i />
      </span>
      <span className="v3-project-frame__index">{pad(index + 1)}</span>
      <span className="v3-project-frame__copy">
        <small>{project.category}</small>
        <strong>{project.title}</strong>
        <em>{ready ? "Enter project" : ""}</em>
      </span>
      <span className="v3-project-frame__enter" aria-hidden="true">↗</span>
    </button>
  );
}

function WorkScrollStory({ onOpen }: { onOpen: (project: Project) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [pin, setPin] = useState<PinState>("before");
  const [targetIndex, setTargetIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [videoMissing, setVideoMissing] = useState(false);
  const currentProject = projects[targetIndex];
  const storyHeight = `${projects.length * 158}vh`;

  useEffect(() => setVideoMissing(false), [targetIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const target = clamp(localProgress) * Math.max(0.01, video.duration - 0.035);
    if (Math.abs(video.currentTime - target) > 0.018) video.currentTime = target;
  }, [localProgress, targetIndex]);

  useEffect(() => {
    const update = () => {
      rafRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const range = Math.max(1, section.offsetHeight - viewport);

      if (rect.top > 0) setPin("before");
      else if (rect.bottom <= viewport) setPin("after");
      else setPin("active");

      const normalized = clamp(-rect.top / range);
      const raw = Math.min(projects.length - 0.0001, normalized * projects.length);
      const index = Math.min(projects.length - 1, Math.floor(raw));
      setTargetIndex(index);
      setLocalProgress(clamp(raw - index));
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
  }, []);

  const liveReveal = clamp((localProgress - 0.86) / 0.12);
  const movieOpacity = 1 - clamp((localProgress - 0.9) / 0.09);

  return (
    <section id="work-story" ref={sectionRef} className="v3-story" style={{ height: storyHeight }} aria-label="Scroll-controlled project films">
      <div className={`v3-film-stage is-${pin}`}>
        <div className="v3-film-stage__movie" style={{ opacity: movieOpacity }}>
          {!videoMissing && (
            <video
              key={targetIndex}
              ref={videoRef}
              src={transitionVideo(targetIndex)}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                event.currentTarget.pause();
                event.currentTarget.currentTime = localProgress * Math.max(0.01, event.currentTarget.duration - 0.035);
              }}
              onError={() => setVideoMissing(true)}
            />
          )}
          {videoMissing && (
            <div className={`v3-film-fallback v3-film-fallback--${currentProject.transition}`} aria-hidden="true">
              <span /><span /><span />
              <img src={currentProject.image} alt="" />
            </div>
          )}
        </div>

        <ProjectLiveFrame project={currentProject} index={targetIndex} reveal={liveReveal} onOpen={onOpen} />

        <div className="v3-film-stage__timeline" aria-hidden="true">
          {projects.map((project, index) => <span key={project.id} className={index === targetIndex ? "is-current" : index < targetIndex ? "is-past" : ""} />)}
        </div>
        <div className="v3-film-stage__counter"><span>{pad(targetIndex + 1)}</span><i /><span>{pad(projects.length)}</span></div>
        <p className="v3-film-stage__hint">Scroll controls every frame · reverse to rewind</p>
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
    <article className={`case-study v3-case-study case-study--${project.transition}`}>
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

function ProjectPortal({ project, direction }: { project: Project; direction: "in" | "out" }) {
  return (
    <div className={`v3-portal v3-portal--${project.transition} is-${direction}`} aria-hidden="true">
      <div className="v3-portal__color"><i /><i /><i /></div>
      <div className="v3-portal__frame"><img src={project.image} alt="" /><span /></div>
      <div className="v3-portal__slices"><i /><i /><i /><i /></div>
      <div className="v3-portal__title"><small>{project.category}</small><strong>{project.title}</strong></div>
    </div>
  );
}

export default function CinematicPortfolio() {
  const [mode, setMode] = useState<Mode>("journey");
  const [introDone, setIntroDone] = useState(false);
  const [introNearEnd, setIntroNearEnd] = useState(false);
  const [introFailed, setIntroFailed] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [portal, setPortal] = useState<"in" | "out" | null>(null);
  const [journeyZone, setJourneyZone] = useState<"home" | "work">("home");
  const introTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.portfolioScene = mode;
    return () => { delete document.documentElement.dataset.portfolioScene; };
  }, [mode]);

  useEffect(() => {
    introTimer.current = window.setTimeout(() => {
      setIntroFailed(true);
      setIntroNearEnd(true);
      window.setTimeout(() => setIntroDone(true), 260);
    }, 10500);
    return () => { if (introTimer.current) window.clearTimeout(introTimer.current); };
  }, []);

  useEffect(() => {
    const updateZone = () => setJourneyZone(window.scrollY > window.innerHeight * 0.72 ? "work" : "home");
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
    if (portal) return;
    setSelected(project);
    setMode("case");
    setPortal("in");
    window.setTimeout(() => setPortal(null), 1900);
  };

  const closeProject = () => {
    if (!selected || portal) return;
    setPortal("out");
    window.setTimeout(() => {
      setMode("journey");
      setPortal(null);
      setSelected(null);
    }, 1500);
  };

  const activeNav: NavTarget = mode === "about" ? "about" : mode === "contact" ? "contact" : journeyZone;
  const hubVisible = introDone || introNearEnd || introFailed;

  return (
    <main className={`cinematic-portfolio cinematic-portfolio--v3 mode-${mode} ${introDone ? "intro-complete" : ""}`}>
      <div className="world-background" aria-hidden="true"><span className="world-background__cyan" /><span className="world-background__magenta" /><span className="world-background__yellow" /><span className="world-background__grain" /></div>

      <div className={`v3-journey ${mode === "journey" ? "is-current" : ""}`} aria-hidden={mode !== "journey"}>
        <section className="v3-opening" aria-label="Portfolio opening">
          {!introDone && !introFailed && (
            <video
              className={`v3-opening__film ${introNearEnd ? "is-ending" : ""}`}
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
      </div>

      {introDone && <TopRail active={activeNav} onNavigate={goTo} />}
      {mode === "about" && <div className="scene-overlay is-visible"><AboutScene onWork={() => goTo("work")} onContact={() => goTo("contact")} /></div>}
      {mode === "contact" && <div className="scene-overlay is-visible"><ContactScene /></div>}
      {mode === "case" && selected && <div className="scene-overlay scene-overlay--case is-visible"><CaseStudy project={selected} onClose={closeProject} /></div>}
      {selected && portal && <ProjectPortal project={selected} direction={portal} />}
      <div className="cursor-light" aria-hidden="true" />
    </main>
  );
}
