"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { HeroLogo } from "@/components/AnimatedLogo";

const featuredProjects = [
  {
    title: "Company Redesign",
    category: "Brand Identity",
    image: "/Essets/BIGFUN.jpg",
    note: "Energetic identity system with bold color and celebratory motion potential.",
  },
  {
    title: "HAKAMERI Brochure",
    category: "Editorial / Print",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    note: "Structured layout work that can anchor a more refined editorial section.",
  },
  {
    title: "Digital Painting",
    category: "Digital Art",
    image: "/Essets/DIGITAL PAINTING.jpg",
    note: "Painterly depth and atmosphere that fit the new immersive motion language.",
  },
];

const pillars = [
  {
    title: "CMY Energy",
    text: "The new language is built from cyan, magenta, and yellow as living materials rather than flat brand swatches.",
  },
  {
    title: "Ink Dynamics",
    text: "Drops, flow, overlap, separation, and recombination become the basis of motion, transitions, and interaction.",
  },
  {
    title: "Polychrome Luxury",
    text: "The final aesthetic should feel darker, more cinematic, and more elevated than a standard designer portfolio.",
  },
];

export default function OverhaulExperiencePage() {
  const [pointer, setPointer] = useState({ x: 50, y: 20 });

  const spotlight = useMemo(
    () => ({
      background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.14), transparent 28%), radial-gradient(circle at 18% 18%, rgba(0, 220, 255, 0.22), transparent 18%), radial-gradient(circle at 82% 22%, rgba(255, 0, 166, 0.20), transparent 16%), radial-gradient(circle at 50% 88%, rgba(255, 221, 0, 0.18), transparent 16%), linear-gradient(180deg, #06070a 0%, #0b0d12 42%, #090a0e 100%)`,
    }),
    [pointer]
  );

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      onMouseMove={(e) => {
        const { innerWidth, innerHeight } = window;
        setPointer({
          x: (e.clientX / innerWidth) * 100,
          y: (e.clientY / innerHeight) * 100,
        });
      }}
      style={spotlight}
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.05%22/%3E%3C/svg%3E')] mix-blend-screen opacity-30" />

      <main className="relative z-10">
        <section className="min-h-screen px-6 py-10 md:px-10 lg:px-16 flex flex-col">
          <div className="flex items-center justify-between gap-4 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full px-4 py-3 md:px-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <HeroLogo />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/55">Experimental route</p>
                <p className="text-sm text-white/85">Portfolio overhaul in progress</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Cyan</span>
              <span>•</span>
              <span>Magenta</span>
              <span>•</span>
              <span>Yellow</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center pt-14 md:pt-20 lg:pt-28 pb-12">
            <div>
              <p className="mb-5 text-sm md:text-base uppercase tracking-[0.35em] text-cyan-200/80">Cinematic / Interactive / Brand-first</p>
              <h1 className="text-5xl md:text-7xl xl:text-[6.2rem] leading-[0.95] font-semibold tracking-[-0.04em] max-w-4xl">
                Ink, color, and motion forming a new digital identity.
              </h1>
              <p className="mt-7 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed">
                This route is the beginning of a darker, richer portfolio experience inspired by your existing logo,
                print-color language, and the ink / polychrome energy from your earlier branding material.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm text-cyan-100">Liquid color fusion</div>
                <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-5 py-3 text-sm text-fuchsia-100">Interactive storytelling</div>
                <div className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-5 py-3 text-sm text-yellow-100">Portfolio as an experience</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-fuchsia-500/10 to-yellow-300/15 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/30">
                <div className="mb-6 flex items-center justify-between text-sm text-white/50 uppercase tracking-[0.24em]">
                  <span>Opening direction</span>
                  <span>01 / 05</span>
                </div>
                <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/30 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(0,221,255,0.58),transparent_23%),radial-gradient(circle_at_75%_28%,rgba(255,0,170,0.56),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(255,224,56,0.5),transparent_22%),linear-gradient(180deg,rgba(8,9,12,0.72),rgba(6,7,10,0.96))]" />
                  <div className="absolute inset-0 mix-blend-screen opacity-80 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.35),transparent_15%),radial-gradient(circle_at_48%_48%,rgba(255,255,255,0.12),transparent_30%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4 backdrop-blur-md">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/50 mb-2">Scene blueprint</p>
                      <p className="text-white/80 leading-relaxed text-sm md:text-base">
                        CMY droplets emerge in darkness, overlap into living polychrome light, then converge into a refined identity reveal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 lg:px-16 pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-7"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40 mb-5">0{index + 1}</p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] mb-4">{pillar.title}</h2>
                <p className="text-white/70 leading-relaxed">{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-10 lg:px-16 pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-white/45 mb-3">Selected work</p>
                <h2 className="text-3xl md:text-5xl tracking-[-0.04em] font-semibold">Projects that can shine inside the new world.</h2>
              </div>
              <p className="text-white/55 max-w-xl leading-relaxed">
                The current portfolio content remains valuable; the goal is to elevate how it is revealed, framed, and explored.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <article
                  key={project.title}
                  className="group rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.035] backdrop-blur-xl"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45 mb-3">{project.category}</p>
                    <h3 className="text-2xl tracking-[-0.03em] font-semibold mb-3">{project.title}</h3>
                    <p className="text-white/65 leading-relaxed">{project.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
