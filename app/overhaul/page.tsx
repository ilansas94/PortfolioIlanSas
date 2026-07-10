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
    title: "Gesture Poster",
    category: "Poster Design",
    group: "Print",
    image: "/Essets/GESTURE POSTER.jpg",
    detailImage: "/Essets/GESTURE POSTER_inside.jpg",
    description:
      "Expressive movement translated into poster form with energetic line, compositional rhythm, and high-contrast visual impact.",
    tools: ["Illustrator", "Photoshop"],
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
    title: "SPACE",
    category: "Logo Design",
    group: "Identity",
    image: "/Essets/SPACE LOGO.jpg",
    detailImage: "/Essets/SPACE LOGO_inside.jpg",
    description:
      "A modern logo concept built around orbital motion, negative space, and a dark-friendly technological feel.",
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

const blobLinks = [
  {
    label: "Work",
    sub: "Selected projects",
    href: "work",
    tint: "from-cyan-300/85 to-cyan-500/75",
    border: "border-cyan-100/35",
    glow: "shadow-[0_0_80px_rgba(32,222,255,0.25)]",
  },
  {
    label: "About",
    sub: "Process & practice",
    href: "about",
    tint: "from-fuchsia-300/85 to-fuchsia-600/75",
    border: "border-fuchsia-100/35",
    glow: "shadow-[0_0_80px_rgba(255,20,173,0.24)]",
  },
  {
    label: "Contact",
    sub: "Start a project",
    href: "contact",
    tint: "from-yellow-200/90 to-yellow-400/75",
    border: "border-yellow-100/40",
    glow: "shadow-[0_0_80px_rgba(255,210,40,0.22)]",
  },
] as const;

function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function OverhaulExperiencePage() {
  const [pointer, setPointer] = useState({ x: 52, y: 28 });
  const [introVisible, setIntroVisible] = useState(true);
  const [activeBlob, setActiveBlob] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setIntroVisible(false), 3600);
    return () => window.clearTimeout(hideTimer);
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === "All" || project.group === filter),
    [filter]
  );

  const pageBackground = useMemo(
    () => ({
      background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,.09), transparent 20%), linear-gradient(180deg, #040507 0%, #090b11 44%, #06070a 100%)`,
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
      <div className="fixed inset-0 pointer-events-none opacity-[0.045] mix-blend-screen bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22 viewBox=%220 0 180 180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22180%22 height=%22180%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>

      <AnimatePresence>
        {introVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.75, ease: "easeInOut" } }}
            className="fixed inset-0 z-[80] overflow-hidden bg-[#050609]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_28%)]" />
            <motion.div
              className="absolute left-[15%] top-[22%] h-[34vw] w-[34vw] max-h-[480px] max-w-[480px] rounded-full bg-cyan-400/80 blur-[70px] mix-blend-screen"
              initial={{ x: -220, y: 110, scale: 0.6, opacity: 0 }}
              animate={{ x: 40, y: 10, scale: 1.05, opacity: 0.88 }}
              transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute right-[16%] top-[22%] h-[32vw] w-[32vw] max-h-[450px] max-w-[450px] rounded-full bg-fuchsia-500/80 blur-[74px] mix-blend-screen"
              initial={{ x: 240, y: 90, scale: 0.58, opacity: 0 }}
              animate={{ x: -30, y: 14, scale: 1.04, opacity: 0.88 }}
              transition={{ duration: 1.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute bottom-[11%] left-1/2 h-[28vw] w-[28vw] max-h-[380px] max-w-[380px] -translate-x-1/2 rounded-full bg-yellow-300/80 blur-[76px] mix-blend-screen"
              initial={{ y: 180, scale: 0.62, opacity: 0 }}
              animate={{ y: -10, scale: 1.08, opacity: 0.84 }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="relative flex h-full items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.86, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-[2.5rem] border border-white/12 bg-black/20 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl md:h-56 md:w-56">
                  <AnimatedLogo size="lg" hover={false} loop />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.5 }}
                  className="mt-8 text-[11px] uppercase tracking-[0.42em] text-white/52 md:text-xs"
                >
                  Cyan · Magenta · Yellow · Identity in motion
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.7 }}
                  className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl"
                >
                  Color becomes form. Form becomes identity.
                </motion.h1>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl md:px-6">
          <button onClick={() => scrollToId("home")} className="flex items-center gap-3 text-left" aria-label="Go to top">
            <AnimatedLogo size="sm" hover={false} loop />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium">Ilan Sastiel</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Designer / Artist</p>
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
                className="rounded-full px-3 py-2 text-white/62 transition hover:bg-white/10 hover:text-white md:px-4"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40 lg:px-16 lg:pt-44">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[6%] top-[10%] h-[44vw] max-h-[620px] w-[44vw] max-w-[620px] rounded-full bg-cyan-400/30 blur-[82px] mix-blend-screen" />
            <div className="absolute right-[4%] top-[12%] h-[40vw] max-h-[580px] w-[40vw] max-w-[580px] rounded-full bg-fuchsia-500/28 blur-[82px] mix-blend-screen" />
            <div className="absolute bottom-[10%] left-[32%] h-[32vw] max-h-[430px] w-[32vw] max-w-[430px] rounded-full bg-yellow-300/25 blur-[84px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,6,9,.22)_42%,rgba(5,6,9,.94)_100%)]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.34em] text-cyan-100/74 md:text-sm">
                Brand identity · digital art · visual storytelling
              </p>
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-8xl xl:text-[7.2rem]">
                A portfolio built like
                <span className="block bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-100 bg-clip-text text-transparent">
                  liquid identity.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/64 md:text-xl">
                Branding, logo design, digital painting, print, and interactive concepts—reframed through color, motion, depth, and a more cinematic visual world.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToId("work")}
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  Explore selected work
                </button>
                <button
                  onClick={() => scrollToId("contact")}
                  className="rounded-full border border-white/14 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
                >
                  Start a conversation
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-[2.8rem] border border-white/12 bg-white/[0.045] p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl md:p-7">
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/25 px-5 py-7 md:px-8 md:py-9">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(33,225,255,0.32),transparent_24%),radial-gradient(circle_at_78%_24%,rgba(255,10,170,0.28),transparent_22%),radial-gradient(circle_at_50%_82%,rgba(255,215,48,0.26),transparent_20%)]"></div>

                  <div className="relative mx-auto flex min-h-[390px] max-w-[520px] flex-col justify-between md:min-h-[520px]">
                    <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.3em] text-white/42">
                      <span>Interactive liquid navigation</span>
                      <span>Preview</span>
                    </div>

                    <div className="relative mx-auto mt-8 flex w-full max-w-[430px] items-center justify-center py-10">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                        className="absolute h-[82%] w-[82%] rounded-full border border-white/10"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                        className="absolute h-[62%] w-[62%] rounded-full border border-dashed border-white/12"
                      />

                      <div className="relative z-10 flex items-center justify-center">
                        <div className="absolute left-1/2 top-1/2 h-10 w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300/20 via-fuchsia-300/20 to-yellow-200/20 blur-xl" />

                        {[0, 1].map((index) => (
                          <motion.div
                            key={index}
                            className="pointer-events-none absolute top-1/2 h-7 rounded-full bg-white/12 blur-md"
                            animate={{ opacity: activeBlob ? 0.95 : 0.35, scaleX: activeBlob ? 1.06 : 0.86 }}
                            style={{
                              width: 74,
                              left: index === 0 ? "35%" : "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        ))}

                        <div className="relative flex items-center">
                          {blobLinks.map((blob, index) => (
                            <motion.button
                              key={blob.label}
                              onMouseEnter={() => setActiveBlob(blob.label)}
                              onMouseLeave={() => setActiveBlob(null)}
                              onFocus={() => setActiveBlob(blob.label)}
                              onBlur={() => setActiveBlob(null)}
                              onClick={() => scrollToId(blob.href)}
                              whileHover={{ y: -8, scale: 1.06 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative z-10 h-28 w-28 overflow-hidden rounded-full border ${blob.border} bg-gradient-to-br ${blob.tint} ${blob.glow} backdrop-blur-xl md:h-32 md:w-32 ${index !== 0 ? "-ml-5 md:-ml-6" : ""}`}
                            >
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,.62),transparent_24%)]" />
                              <div className="absolute inset-[10%] rounded-full border border-white/18" />
                              <div className="relative flex h-full flex-col items-center justify-center px-3 text-center text-black">
                                <span className="text-base font-semibold tracking-[-0.03em] md:text-lg">{blob.label}</span>
                                <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-black/65">{blob.sub}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5 backdrop-blur-lg">
                      <p className="text-xs uppercase tracking-[0.26em] text-white/40">Direction</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                        The main actions behave like liquid nodes—hovered forms swell, visually bridge, and feel as if they are being pulled together before relaxing back apart.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-12 md:px-10 md:pb-20 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(0,216,255,0.28),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(255,0,168,0.22),transparent_22%),radial-gradient(circle_at_56%_86%,rgba(255,225,72,0.18),transparent_18%)]" />
              <div className="relative flex min-h-[260px] flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/42">
                  <span>Cinematic opening</span>
                  <span>Auto-play feeling</span>
                </div>
                <div>
                  <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
                    The entrance should happen immediately, not wait for the user to be told what to do.
                  </h2>
                  <p className="mt-4 max-w-2xl text-white/62 md:text-lg">
                    This version shifts the opening toward an automatic reveal: color masses converge, the brand resolves, and only then the interface settles into something usable.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Reveal",
                  text: "The site opens with color and identity before any interaction is required.",
                },
                {
                  n: "02",
                  title: "Merge",
                  text: "Primary actions feel like droplets that nearly fuse on hover.",
                },
                {
                  n: "03",
                  title: "Explore",
                  text: "Projects are discovered inside a darker, more editorial interface.",
                },
              ].map((item) => (
                <article key={item.n} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/38">{item.n}</p>
                  <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/58">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-fuchsia-100/66">Selected portfolio</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Work with a strong visual point of view.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/58 lg:justify-self-end">
                The content is the same portfolio substance—but surfaced through a more dramatic world, deeper spacing, stronger contrast, and more intentional pacing.
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
                  viewport={{ once: true, amount: 0.25 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
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

        <section id="about" className="relative px-5 py-16 md:px-10 md:py-24 lg:px-16">
          <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
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
                Instinct, structure, and story—working together.
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-white/62 md:text-lg">
                <p>
                  I’m a multidisciplinary designer and digital artist working across identity, illustration, print, and interface concepts.
                </p>
                <p>
                  My process moves between intuitive image-making and systems thinking. I care about atmosphere and emotion, but also clarity, hierarchy, and how work behaves in the real world.
                </p>
                <p>
                  This direction tries to merge those qualities: expressive color and material on one side, precision and design logic on the other.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  ["17+", "Projects"],
                  ["5+", "Years"],
                  ["100%", "Curiosity"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-2xl font-semibold md:text-3xl">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/65">How I think</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">A visual system, not isolated decoration.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Discover", "Understand the context, audience, and emotional target before styling anything."],
                  ["02", "Shape", "Build the language through form, type, color, image, and rhythm."],
                  ["03", "Systemize", "Make the work flexible enough to live across real touchpoints."],
                  ["04", "Refine", "Remove noise, strengthen hierarchy, and polish each interaction."],
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

        <section id="contact" className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
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

      <footer className="border-t border-white/10 px-5 py-8 md:px-10 lg:px-16">
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
