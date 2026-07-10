"use client";

import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedLogo } from "@/components/AnimatedLogo";

type Group = "Identity" | "Print" | "Digital" | "UX";
type Filter = "All" | Group;

type Project = {
  title: string;
  category: string;
  group: Group;
  image: string;
  detailImage?: string;
  description: string;
  tools: string[];
};

const INTRO_VIDEO =
  "https://dnznrvs05pmza.cloudfront.net/seedance_2/cgt-20260710211009-96nbv/Animate_a_premium_dark_homepage_opening_sequence_between_these_two_frames__The_glossy_cyan__magenta_.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNGY5ZTEyNjc3MThlNWViMCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4MzgyOTg2M30.6mDoOP1-Al4ar0P-d-LT6ZoTVxFVlxUXaN3uEKbczCE";

const START_FRAME =
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/313e066a-8fb2-467e-a237-abb77c565caa/Create_one_single_full_screen_cinematic_image_inspired_by_th.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZmUxNzY4NzYzMWEwYWQ4YyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4Mzc4NTMzNH0.X7nzxbCjjyveAuhGvqKIIQfQn-ellNC52QUNPH3uuG0";

const END_FRAME =
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/8dfee68c-329b-4792-a8e3-552a9a7431e1/Create_one_single_full_screen_cinematic_image_inspired_by_th.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMjI5ZGY0OTNkYWVmYzlkNiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4MzgxMDcwN30.7PIJ6w12raxzI9gjCj5aKpmPNKhZQlzhTfOZtZRW5_E";

const projects: Project[] = [
  {
    title: "Company Redesign",
    category: "Brand Identity",
    group: "Identity",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    description:
      "A bright bilingual identity system with a playful attitude, strong contrast, and applications that carry the brand into print, apparel, and digital touchpoints.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    title: "HAKAMERI Brochure",
    category: "Editorial Design",
    group: "Print",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    detailImage: "/Essets/BROCHURE HAKAMERI_inside.jpg",
    description:
      "A multi-page brochure shaped through disciplined grid structure, sharp hierarchy, and production-aware CMYK editorial design.",
    tools: ["InDesign", "Photoshop"],
  },
  {
    title: "Digital Painting",
    category: "Digital Art",
    group: "Digital",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    description:
      "An atmosphere-led painting process focused on mood, lighting, painterly texture, and emotional color relationships.",
    tools: ["Photoshop", "Procreate"],
  },
  {
    title: "Landing Page Prototype",
    category: "UI / UX",
    group: "UX",
    image: "/Essets/LANDING PAGE PROTOTYPE.png",
    detailImage: "/Essets/LANDING.png",
    description:
      "A responsive landing-page concept designed to communicate value clearly, structure information intelligently, and convert attention into action.",
    tools: ["Figma"],
  },
  {
    title: "Sketchbook",
    category: "Illustration",
    group: "Digital",
    image: "/Essets/SKETCHBOOK.jpg",
    detailImage: "/Essets/SKETCHBOOK_inside.jpg",
    description:
      "Selected studies that reveal the raw side of the process: anatomy, observation, experimentation, and visual thinking.",
    tools: ["Pencil", "Ink", "Procreate"],
  },
  {
    title: "Keren Nails",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    description:
      "A refined feminine identity with elegant curves, balance, and strong legibility across small and large applications.",
    tools: ["Illustrator"],
  },
  {
    title: "PASSPORTOGO",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/PASSPORTOGO.png",
    detailImage: "/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg",
    description:
      "A friendly travel-oriented logo system that combines direction, movement, and recognizable icon-first branding.",
    tools: ["Illustrator"],
  },
  {
    title: "Twitchy Rabbit",
    category: "Mascot Identity",
    group: "Identity",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    description:
      "A character-driven mascot identity with a memorable silhouette, expressive attitude, and strong use potential for digital communities.",
    tools: ["Illustrator", "Photoshop"],
  },
];

const filters: Filter[] = ["All", "Identity", "Print", "Digital", "UX"];

const expertise = [
  "Brand systems",
  "Logo design",
  "Digital painting",
  "Editorial layout",
  "UI / UX concepts",
  "Illustration",
  "Visual storytelling",
  "Campaign design",
];

const blobs = [
  {
    label: "Work",
    id: "work",
    note: "selected projects",
    tint: "from-fuchsia-500 via-fuchsia-400 to-pink-300",
    glow: "shadow-[0_0_90px_rgba(255,0,170,.32)]",
  },
  {
    label: "About",
    id: "about",
    note: "process & profile",
    tint: "from-cyan-400 via-cyan-300 to-sky-200",
    glow: "shadow-[0_0_90px_rgba(0,220,255,.32)]",
  },
  {
    label: "Contact",
    id: "contact",
    note: "start a project",
    tint: "from-yellow-400 via-yellow-300 to-amber-200",
    glow: "shadow-[0_0_90px_rgba(255,215,40,.3)]",
  },
] as const;

function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function OverhaulExperiencePage() {
  const [pointer, setPointer] = useState({ x: 50, y: 30 });
  const [introDismissed, setIntroDismissed] = useState(false);
  const [activeBlob, setActiveBlob] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setIntroDismissed(true), 11500);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === "All" || project.group === filter),
    [filter]
  );

  const pageBackground = useMemo(
    () => ({
      background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.08), transparent 20%), linear-gradient(180deg, #050608 0%, #090b10 45%, #040507 100%)`,
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

      if (!response.ok) throw new Error("send failed");

      event.currentTarget.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden text-white selection:bg-fuchsia-400/35"
      style={pageBackground}
      onMouseMove={(event) => {
        setPointer({
          x: (event.clientX / window.innerWidth) * 100,
          y: (event.clientY / window.innerHeight) * 100,
        });
      }}
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-screen bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22 viewBox=%220 0 180 180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22180%22 height=%22180%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]" />

      <AnimatePresence>
        {!introDismissed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[90] overflow-hidden bg-black"
          >
            <video
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={START_FRAME}
              onEnded={() => setIntroDismissed(true)}
              onError={() => setIntroDismissed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={INTRO_VIDEO} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_35%,rgba(0,0,0,.82)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-5 md:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-full border border-white/12 bg-black/30 px-4 py-2 backdrop-blur-md">
                  <AnimatedLogo size="sm" hover={false} loop />
                  <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">liquid identity preview</span>
                </div>

                <button
                  onClick={() => setIntroDismissed(true)}
                  className="rounded-full border border-white/14 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/72 backdrop-blur-md transition hover:bg-white/10"
                >
                  Skip intro
                </button>
              </div>

              <div className="max-w-4xl pb-6 md:pb-10">
                <p className="text-[10px] uppercase tracking-[0.42em] text-white/48 md:text-xs">
                  Cyan · Magenta · Yellow · motion-led portfolio
                </p>
                <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-5xl md:text-7xl">
                  The interface is born from the fluid.
                </h1>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl md:px-6">
          <button onClick={() => scrollToId("home")} className="flex items-center gap-3 text-left" aria-label="Go to top">
            <AnimatedLogo size="sm" hover={false} loop />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium text-white/84">Ilan Sastiel</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/36">designer / artist</p>
            </div>
          </button>

          <div className="flex items-center gap-1 text-xs md:gap-2 md:text-sm">
            {[
              ["Work", "work"],
              ["About", "about"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToId(id)}
                className="rounded-full px-3 py-2 text-white/60 transition hover:bg-white/10 hover:text-white md:px-4"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32 lg:px-14 lg:pt-36">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/30 shadow-2xl shadow-black/40 backdrop-blur-xl md:rounded-[3rem]">
            <div className="relative min-h-[760px] overflow-hidden md:min-h-[860px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${END_FRAME})` }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,.02),rgba(0,0,0,.38)_44%,rgba(0,0,0,.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute left-[8%] top-[8%] h-56 w-56 rounded-full bg-cyan-400/15 blur-[90px]" />
              <div className="absolute right-[8%] top-[10%] h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[90px]" />
              <div className="absolute bottom-[18%] left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-400/12 blur-[90px]" />

              <div className="relative flex min-h-[760px] flex-col justify-between p-6 md:min-h-[860px] md:p-10 lg:p-14">
                <div className="max-w-2xl">
                  <p className="text-[10px] uppercase tracking-[0.38em] text-white/46 md:text-xs">
                    experimental overhaul · desktop-first immersion
                  </p>
                  <h1 className="mt-5 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl md:text-8xl lg:text-[6.6rem]">
                    Color.
                    <span className="block">Motion.</span>
                    <span className="block bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-100 bg-clip-text text-transparent">
                      Identity.
                    </span>
                  </h1>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="max-w-xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/40 md:text-xs">
                      the symbol leads. the name stays subtle.
                    </p>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/68 md:text-lg">
                      A more cinematic portfolio built from liquid CMY motion, evolving from the emblem into the main navigation and then into the rest of the experience.
                    </p>
                  </div>

                  <div className="relative mx-auto w-full max-w-[920px] lg:mx-0 lg:w-[920px]">
                    <motion.div
                      animate={{ opacity: activeBlob ? 0.92 : 0.55, scaleX: activeBlob ? 1.04 : 0.94 }}
                      className="pointer-events-none absolute left-1/2 top-1/2 hidden h-8 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-400/25 via-cyan-300/20 to-yellow-300/25 blur-xl md:block"
                    />
                    <div className="relative flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-0">
                      {blobs.map((blob, index) => (
                        <motion.button
                          key={blob.label}
                          onMouseEnter={() => setActiveBlob(blob.label)}
                          onMouseLeave={() => setActiveBlob(null)}
                          onFocus={() => setActiveBlob(blob.label)}
                          onBlur={() => setActiveBlob(null)}
                          onClick={() => scrollToId(blob.id)}
                          whileHover={{ y: -8, scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className={`group relative h-32 w-32 overflow-hidden rounded-full border border-white/15 bg-gradient-to-br ${blob.tint} ${blob.glow} text-black md:h-40 md:w-40 ${index !== 0 ? "md:-ml-8" : ""}`}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_26%,rgba(255,255,255,.82),transparent_24%)]" />
                          <div className="absolute inset-[10%] rounded-full border border-white/18" />
                          <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
                            <span className="text-xl font-semibold tracking-[-0.04em] md:text-2xl">{blob.label}</span>
                            <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-black/65 md:text-[10px]">
                              {blob.note}
                            </span>
                          </div>
                          <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.2),transparent_55%)]" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8 lg:px-14">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">direction</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                The opening sequence is not decoration. It becomes the interface language.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ["01", "Reveal", "CMY fluid introduces the world before any scrolling is needed."],
                ["02", "Morph", "The emblem and the buttons feel like the same living material."],
                ["03", "Navigate", "Projects and content sit inside a darker, more cinematic system."],
              ].map(([n, title, text]) => (
                <article key={n} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/34">{n}</p>
                  <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em]">{title}</h3>
                  <p className="mt-3 leading-relaxed text-white/56">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="px-4 py-16 md:px-8 md:py-24 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.76fr_1.24fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-fuchsia-100/62">Selected work</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                  Projects inside a richer visual world.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/58 lg:justify-self-end">
                The portfolio content stays grounded in your real work, but the presentation moves toward atmosphere, contrast, pacing, and stronger visual memory.
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
                      : "border-white/10 bg-white/[0.035] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <motion.button
                  key={`${project.title}-${filter}`}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="group overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.035] text-left backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/25"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.055]"
                      sizes="(max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">{project.category}</p>
                      <h3 className="mt-2 text-2xl font-medium tracking-[-0.025em]">{project.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5 text-sm text-white/45">
                    <span>{project.tools.join(" · ")}</span>
                    <span className="text-lg transition group-hover:translate-x-1">↗</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-16 md:px-8 md:py-24 lg:px-14">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/20 via-fuchsia-500/15 to-yellow-300/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-3">
                <div className="relative aspect-square overflow-hidden rounded-[1.65rem]">
                  <Image src="/Essets/passport.jpg" alt="Ilan Sastiel" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">Based in Haifa, Israel</p>
                    <p className="mt-2 text-2xl font-medium">Ilan Sastiel</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-yellow-100/65">About the practice</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-6xl">
                Instinct, structure, and storytelling working together.
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-white/62 md:text-lg">
                <p>
                  I’m a multidisciplinary designer and digital artist working across identity, illustration, print, and interface concepts.
                </p>
                <p>
                  My process moves between intuitive image-making and systems thinking. I care about atmosphere and emotion, but also clarity, hierarchy, and how the work behaves in the real world.
                </p>
                <p>
                  This overhaul aims to fuse those qualities: expressive fluid color on one side, stronger interaction design and a more memorable user experience on the other.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24 lg:px-14">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/65">How I think</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                  A visual system, not isolated decoration.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Discover", "Understand the context, audience, and emotional target before styling anything."],
                  ["02", "Shape", "Build the language through form, type, color, image, motion, and rhythm."],
                  ["03", "Systemize", "Make the work flexible enough to live across real touchpoints and interfaces."],
                  ["04", "Refine", "Remove noise, strengthen hierarchy, and polish every interaction."],
                ].map(([n, title, text]) => (
                  <div key={n} className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs tracking-[0.25em] text-white/32">{n}</p>
                    <h3 className="mt-5 text-xl font-medium">{title}</h3>
                    <p className="mt-3 leading-relaxed text-white/52">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 py-16 md:px-8 md:py-24 lg:px-14">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-fuchsia-100/65">Start a conversation</p>
              <h2 className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-7xl">
                Let’s make something people remember.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/58">
                Share the challenge, the goal, or the kind of experience you want to create. I’ll get back to you with a clear next step.
              </p>

              <div className="mt-10 flex gap-3">
                <a
                  href="https://www.instagram.com/art_and_hp/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  Facebook
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-white/50">
                  Name
                  <input
                    name="name"
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40"
                    placeholder="Your name"
                  />
                </label>
                <label className="text-sm text-white/50">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="mt-4 block text-sm text-white/50">
                Subject
                <input
                  name="subject"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-300/40"
                  placeholder="Project, collaboration, or idea"
                />
              </label>

              <label className="mt-4 block text-sm text-white/50">
                Message
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-yellow-200/40"
                  placeholder="Tell me what you want to create..."
                />
              </label>

              <button className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:scale-[1.01] disabled:opacity-50" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending..." : "Send message"}
              </button>

              {formStatus === "success" && <p className="mt-4 text-sm text-green-300">Message sent successfully.</p>}
              {formStatus === "error" && <p className="mt-4 text-sm text-red-300">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 md:px-8 lg:px-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Ilan Sastiel. All rights reserved.</p>
          <p className="uppercase tracking-[0.24em]">Cyan · Magenta · Yellow · Ideas</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-md md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0c11] shadow-2xl shadow-black/45"
            >
              <div className="grid lg:grid-cols-[1.1fr_.9fr]">
                <div className="relative min-h-[320px] lg:min-h-[620px]">
                  <Image
                    src={selectedProject.detailImage || selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                </div>

                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/42">{selectedProject.category}</p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{selectedProject.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <p className="mt-7 text-base leading-relaxed text-white/64 md:text-lg">{selectedProject.description}</p>

                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Tools</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedProject.tools.map((tool) => (
                        <span key={tool} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
