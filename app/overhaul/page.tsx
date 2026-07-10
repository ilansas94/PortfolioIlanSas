"use client";

import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedLogo } from "@/components/AnimatedLogo";

type Project = {
  title: string;
  category: string;
  group: "Identity" | "Print" | "Digital" | "UX";
  image: string;
  detailImage: string;
  description: string;
  tools: string[];
};

const projects: Project[] = [
  {
    title: "Company Redesign",
    category: "Brand Identity",
    group: "Identity",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    description: "A playful bilingual identity system with a bright celebratory palette, flexible iconography, and applications across stationery, apparel, and social media.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    title: "HAKAMERI Brochure",
    category: "Editorial Design",
    group: "Print",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    detailImage: "/Essets/BROCHURE HAKAMERI_inside.jpg",
    description: "A clean multi-page brochure built on a strict grid, generous white space, and print-ready CMYK production standards.",
    tools: ["InDesign", "Photoshop"],
  },
  {
    title: "Digital Painting",
    category: "Digital Art",
    group: "Digital",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    description: "A layered painterly exploration focused on atmosphere, light, texture, and emotional color scripting.",
    tools: ["Photoshop", "Procreate"],
  },
  {
    title: "Gesture Poster",
    category: "Poster Design",
    group: "Print",
    image: "/Essets/GESTURE POSTER.jpg",
    detailImage: "/Essets/GESTURE POSTER_inside.jpg",
    description: "Expressive motion translated into large-format composition through energetic line work, texture, and visual rhythm.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    title: "Keren Nails",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    description: "A refined feminine identity with soft curves, balanced typography, and strong clarity at small sizes.",
    tools: ["Illustrator"],
  },
  {
    title: "Landing Page Prototype",
    category: "UI / UX",
    group: "UX",
    image: "/Essets/LANDING PAGE PROTOTYPE.png",
    detailImage: "/Essets/LANDING.png",
    description: "A responsive mini-course landing page with a clear value proposition, structured content hierarchy, pricing, and conversion-focused calls to action.",
    tools: ["Figma"],
  },
  {
    title: "PASSPORTOGO",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/PASSPORTOGO.png",
    detailImage: "/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg",
    description: "A friendly travel identity combining movement, direction, and icon-first recognition across digital touchpoints.",
    tools: ["Illustrator"],
  },
  {
    title: "Sketchbook",
    category: "Illustration",
    group: "Digital",
    image: "/Essets/SKETCHBOOK.jpg",
    detailImage: "/Essets/SKETCHBOOK_inside.jpg",
    description: "Selected studies exploring anatomy, objects, gesture, composition, and the raw thinking process behind finished work.",
    tools: ["Pencil", "Ink", "Procreate"],
  },
  {
    title: "SPACE",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/SPACE LOGO.jpg",
    detailImage: "/Essets/SPACE LOGO_inside.jpg",
    description: "A modern technology-oriented mark using orbital movement, negative space, and dark-mode adaptability.",
    tools: ["Illustrator"],
  },
  {
    title: "Twitchy Rabbit",
    category: "Mascot Identity",
    group: "Identity",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    description: "An energetic mascot with a strong silhouette and expressive character, designed for gaming and streaming environments.",
    tools: ["Illustrator", "Photoshop"],
  },
];

const expertise = [
  "Brand systems",
  "Logo design",
  "Campaign design",
  "Digital painting",
  "Editorial layout",
  "UI / UX concepts",
  "Illustration",
  "Visual storytelling",
];

const filters = ["All", "Identity", "Print", "Digital", "UX"] as const;
type Filter = (typeof filters)[number];

export default function OverhaulExperiencePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 32 });
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const updateProgress = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const scrollable = Math.max(1, hero.offsetHeight - window.innerHeight);
      const next = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(next);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const visibleProjects = useMemo(
    () => projects.filter((project) => filter === "All" || project.group === filter),
    [filter]
  );

  const pageBackground = useMemo(
    () => ({
      background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,.08), transparent 22%), linear-gradient(180deg,#050609 0%,#080a0f 42%,#06070a 100%)`,
    }),
    [pointer]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      if (!response.ok) throw new Error("Unable to send");
      event.currentTarget.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden text-white selection:bg-fuchsia-500/30"
      style={pageBackground}
      onMouseMove={(event) => {
        setPointer({
          x: (event.clientX / window.innerWidth) * 100,
          y: (event.clientY / window.innerHeight) * 100,
        });
      }}
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.045] mix-blend-screen bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl md:px-6">
          <a href="#home" className="flex items-center gap-3" aria-label="Go to top">
            <AnimatedLogo size="sm" hover={false} loop />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium">Ilan Sastiel</p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/45">Designer / Artist</p>
            </div>
          </a>
          <div className="flex items-center gap-1 text-xs md:gap-2 md:text-sm">
            {[
              ["Work", "#work"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3 py-2 text-white/65 transition hover:bg-white/10 hover:text-white md:px-4">
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <section id="home" ref={heroRef} className="relative h-[190vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 pt-24 md:px-10 lg:px-16">
            <div className="absolute inset-0">
              <motion.div
                className="absolute left-[8%] top-[18%] h-[44vw] max-h-[620px] w-[44vw] max-w-[620px] rounded-full bg-cyan-400/35 blur-[80px] mix-blend-screen"
                animate={{
                  x: progress * 260,
                  y: progress * 110,
                  scale: 1 - progress * 0.42,
                  opacity: 0.75 - progress * 0.25,
                }}
              />
              <motion.div
                className="absolute right-[5%] top-[15%] h-[42vw] max-h-[590px] w-[42vw] max-w-[590px] rounded-full bg-fuchsia-500/35 blur-[82px] mix-blend-screen"
                animate={{
                  x: progress * -260,
                  y: progress * 130,
                  scale: 1 - progress * 0.4,
                  opacity: 0.75 - progress * 0.2,
                }}
              />
              <motion.div
                className="absolute bottom-[2%] left-[31%] h-[39vw] max-h-[540px] w-[39vw] max-w-[540px] rounded-full bg-yellow-300/30 blur-[85px] mix-blend-screen"
                animate={{
                  y: progress * -240,
                  scale: 1 - progress * 0.38,
                  opacity: 0.72 - progress * 0.2,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,6,9,.18)_42%,rgba(5,6,9,.9)_100%)]" />
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
              <motion.div
                style={{
                  opacity: Math.max(0.12, 1 - progress * 1.55),
                  transform: `translateY(${-progress * 90}px)`,
                }}
              >
                <p className="mb-5 text-xs uppercase tracking-[0.34em] text-cyan-100/75 md:text-sm">Multidisciplinary designer · Haifa</p>
                <h1 className="max-w-5xl text-5xl font-semibold leading-[.92] tracking-[-.055em] sm:text-6xl md:text-8xl xl:text-[7.4rem]">
                  Ideas become
                  <span className="block bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-100 bg-clip-text text-transparent">living color.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/65 md:text-xl">
                  Branding, digital art, illustration, and interactive design shaped into memorable visual experiences.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#work" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">Explore selected work</a>
                  <a href="#about" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10">Meet the designer</a>
                </div>
              </motion.div>

              <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[620px]">
                <motion.div
                  className="absolute h-[72%] w-[72%] rounded-full border border-white/10"
                  animate={{ rotate: progress * 120, scale: 1 - progress * 0.12 }}
                />
                <motion.div
                  className="absolute h-[54%] w-[54%] rounded-full border border-dashed border-white/15"
                  animate={{ rotate: progress * -180, scale: 1 + progress * 0.15 }}
                />
                <motion.div
                  className="relative z-10 rounded-[3rem] border border-white/10 bg-black/20 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  animate={{
                    scale: 0.78 + progress * 0.32,
                    rotate: -4 + progress * 4,
                    opacity: 0.58 + progress * 0.42,
                  }}
                >
                  <AnimatedLogo size="2xl" hover={false} loop />
                </motion.div>
                <motion.p
                  className="absolute bottom-5 text-center text-xs uppercase tracking-[0.3em] text-white/40"
                  animate={{ opacity: 1 - progress * 2 }}
                >
                  Scroll to fuse the colors
                </motion.p>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-300" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </section>

        <section id="work" className="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-fuchsia-200/70">Selected portfolio</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] md:text-6xl">Work with a point of view.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/58 lg:justify-self-end">
                Identity, print, digital art, and interface concepts—reframed in a darker, more editorial environment that gives every project room to breathe.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    filter === item
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/[.035] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, index) => (
                  <motion.button
                    layout
                    key={project.title}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: index * 0.035 }}
                    onClick={() => setSelectedProject(project)}
                    className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[.035] text-left backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/25"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image src={project.image} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-[1.055]" sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[10px] uppercase tracking-[.28em] text-white/50">{project.category}</p>
                        <h3 className="mt-2 text-2xl font-medium tracking-[-.025em]">{project.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-6 py-5 text-sm text-white/45">
                      <span>{project.tools.join(" · ")}</span>
                      <span className="text-lg transition group-hover:translate-x-1">↗</span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section id="about" className="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/20 via-fuchsia-500/15 to-yellow-300/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[.04] p-3">
                <div className="relative aspect-square overflow-hidden rounded-[1.65rem]">
                  <Image src="/Essets/passport.jpg" alt="Ilan Sastiel" fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[.28em] text-white/50">Based in Haifa, Israel</p>
                    <p className="mt-2 text-2xl font-medium">Ilan Sastiel</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[.34em] text-yellow-100/65">About the practice</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">Designing with instinct, structure, and story.</h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-white/62 md:text-lg">
                <p>I’m a multidisciplinary designer and digital artist working across brand identity, illustration, print, and interface concepts.</p>
                <p>My process moves between intuitive image-making and careful systems thinking. I care about how a visual feels, but also how it communicates, scales, and lives across different formats.</p>
                <p>This new portfolio direction brings those two sides together: expressive color and material, supported by clear hierarchy and interactive storytelling.</p>
              </div>
              <div className="mt-9 flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/62">{item}</span>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  ["17+", "Projects"],
                  ["5+", "Years"],
                  ["100%", "Curiosity"],
                ].map(([number, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                    <p className="text-2xl font-semibold md:text-3xl">{number}</p>
                    <p className="mt-1 text-xs uppercase tracking-[.18em] text-white/38">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[.035] p-7 backdrop-blur-xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
              <div>
                <p className="text-xs uppercase tracking-[.34em] text-cyan-100/65">How I think</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] md:text-5xl">A visual system, not isolated decoration.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Discover", "Understand the idea, audience, context, and emotional target."],
                  ["02", "Shape", "Build the visual language through form, type, color, image, and rhythm."],
                  ["03", "Systemize", "Make the work flexible enough to live across real applications."],
                  ["04", "Refine", "Remove noise, strengthen hierarchy, and polish every interaction."],
                ].map(([number, title, text]) => (
                  <div key={number} className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs tracking-[.25em] text-white/32">{number}</p>
                    <h3 className="mt-5 text-xl font-medium">{title}</h3>
                    <p className="mt-3 leading-relaxed text-white/52">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[.34em] text-fuchsia-100/65">Start a conversation</p>
              <h2 className="mt-4 text-5xl font-semibold leading-[.98] tracking-[-.05em] md:text-7xl">Let’s make something people remember.</h2>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/58">Share the idea, challenge, or direction. I’ll get back to you with a clear next step.</p>
              <div className="mt-10 flex gap-3">
                <a href="https://www.instagram.com/art_and_hp/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">Instagram</a>
                <a href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">Facebook</a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-white/50">Name<input required name="name" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40" placeholder="Your name" /></label>
                <label className="text-sm text-white/50">Email<input required type="email" name="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40" placeholder="you@example.com" /></label>
              </div>
              <label className="mt-4 block text-sm text-white/50">Subject<input required name="subject" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-300/40" placeholder="Project, collaboration, or idea" /></label>
              <label className="mt-4 block text-sm text-white/50">Message<textarea required name="message" rows={6} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-yellow-200/40" placeholder="Tell me what you want to create..." /></label>
              <button disabled={formStatus === "sending"} className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:scale-[1.01] disabled:opacity-50">
                {formStatus === "sending" ? "Sending…" : "Send message"}
              </button>
              {formStatus === "success" && <p className="mt-4 text-sm text-emerald-300">Message sent successfully.</p>}
              {formStatus === "error" && <p className="mt-4 text-sm text-red-300">The message could not be sent. Please try again.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ilan Sastiel. All rights reserved.</p>
          <p className="uppercase tracking-[.24em]">Cyan · Magenta · Yellow · Ideas</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 backdrop-blur-xl md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="relative grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0d12] shadow-2xl lg:grid-cols-[1.2fr_.8fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-xl backdrop-blur">×</button>
              <div className="max-h-[92vh] overflow-y-auto bg-black/30">
                <Image src={selectedProject.detailImage} alt={selectedProject.title} width={1100} height={1500} className="h-auto w-full object-contain" />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-xs uppercase tracking-[.3em] text-white/38">{selectedProject.category}</p>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-.04em] md:text-5xl">{selectedProject.title}</h3>
                <p className="mt-6 text-lg leading-relaxed text-white/58">{selectedProject.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool) => <span key={tool} className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/58">{tool}</span>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
