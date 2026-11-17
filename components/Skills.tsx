"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Section, 
  Container, 
  Heading, 
  GlassCard,
  animations
} from "@/components/DesignSystem";
import { useLanguage } from "@/lib/i18n";


type SkillIconName = "palette" | "brush" | "layout" | "printer" | "sparkles" | "code";

/** Lightweight, consistent line icons without an extra icon dependency. */
const SkillCategoryIcon = ({ name }: { name: SkillIconName }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-white drop-shadow-sm"
  >
    {name === "palette" && (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.1a2.4 2.4 0 0 0 2.36-2.8l-.17-1a2 2 0 0 1 2-2.35H19a2 2 0 0 0 2-2A9 9 0 0 0 12 3Z" />
        <circle cx="7.5" cy="11" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="17" cy="10" r="0.9" fill="currentColor" stroke="none" />
      </>
    )}
    {name === "brush" && (
      <>
        <path d="m14.7 6.3 3-3a2.12 2.12 0 0 1 3 3l-10 10a3 3 0 0 1-4.2-4.2l8.2-5.8Z" />
        <path d="M8 16c-2.8 0-5 2.2-5 5 1.4-1 2.6-1 4-1 2.2 0 3-2 3-4" />
        <path d="m12.6 8.4 3 3" />
      </>
    )}
    {name === "layout" && (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 9v12" />
      </>
    )}
    {name === "sparkles" && (
      <>
        <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
        <path d="M19 17v4m-2-2h4M4 3v4M2 5h4" />
      </>
    )}
    {name === "code" && (
      <>
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
      </>
    )}
    {name === "printer" && (
      <>
        <path d="M6 9V3h12v6" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="7" rx="1" />
        <path d="M18 12h.01" />
      </>
    )}
  </svg>
);

const skillCategories: {
  title: string;
  skills: string[];
  icon: SkillIconName;
  gradient: string;
  indicator: string;
}[] = [
  {
    title: "Design & Branding",
    skills: ["Logo Design", "Brand Identity", "Visual Identity", "Brand Guidelines"],
    icon: "palette",
    gradient: "from-blue-500 to-blue-600",
    indicator: "bg-blue-500"
  },
  {
    title: "Digital Art",
    skills: ["Digital Painting", "Illustration", "Character Design", "Concept Art"],
    icon: "brush",
    gradient: "from-violet-500 to-purple-600",
    indicator: "bg-purple-500"
  },
  {
    title: "UI/UX Design",
    skills: ["User Interface", "User Experience", "Prototyping", "Wireframing"],
    icon: "layout",
    gradient: "from-emerald-500 to-teal-600",
    indicator: "bg-emerald-500"
  },
  {
    title: "Print & Media",
    skills: ["Brochure Design", "Poster Design", "Campaign Design", "Print Layout"],
    icon: "printer",
    gradient: "from-pink-500 to-rose-600",
    indicator: "bg-pink-500"
  }
];

const creativeCapabilities: {
  title: string;
  eyebrow: string;
  icon: "sparkles" | "code";
  description: string;
  tags: string[];
}[] = [
  {
    eyebrow: "Visual creation & motion",
    title: "AI-Assisted Creative Workflows",
    icon: "sparkles",
    description: "I use ChatGPT for research and advanced prompting, Runway for AI video and cinematic transitions, and Photoshop for visual refinement. I also explore node-based generation in ComfyUI, with creative direction guiding every result.",
    tags: ["ChatGPT", "Runway", "Adobe Photoshop", "ComfyUI (Exploration)"]
  },
  {
    eyebrow: "Websites & interactive projects",
    title: "AI-Assisted Development",
    icon: "code",
    description: "Working with OpenAI Codex, I design and develop websites, refine interfaces, and experiment with interactive game prototypes. I combine design thinking with AI-assisted coding, testing and iteration, including projects published through GitHub and Vercel.",
    tags: ["OpenAI Codex", "Web Development", "Game Prototyping", "GitHub & Vercel"]
  }
];

const tools = [
  "Adobe Creative Suite",
  "Figma",
  "Sketch", 
  "Procreate",
  "Blender",
  "After Effects",
  "Photoshop",
  "Illustrator",
  "ChatGPT",
  "OpenAI Codex",
  "GitHub",
  "Vercel",
  "Runway",
  "ComfyUI (Exploration)"
];

export const Skills = () => {
  const { t } = useLanguage();
  return (
    <Section id="skills" className="py-20 lg:py-32" background="gradient">
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          {...animations.fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            {t("Skills & Services")}
          </span>
          <Heading level={2} className="mb-6">
            {t("What I Bring to the Table")}
          </Heading>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("A comprehensive skill set spanning digital design, traditional art, and modern technology to create compelling visual experiences.")}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4 mb-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard
                className="p-6 h-full group hover:scale-[1.015] transition-transform duration-300"
                intensity="medium"
                gradient
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg shadow-slate-900/10 ring-1 ring-white/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl`}
                >
                  <SkillCategoryIcon name={category.icon} />
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {t(category.title)}
                </h3>

                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (skillIndex * 0.05) }}
                      className="flex items-center gap-2"
                    >
                      <div className={`h-2 w-2 flex-none rounded-full ${category.indicator}`}></div>
                      <span className="text-sm text-slate-600">{t(skill)}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>



        {/* AI and creative coding share one design language and equal visual weight. */}
        <div className="mb-16">
          <motion.div
            {...animations.fadeInUp}
            className="mb-7 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              {t("Beyond the Canvas")}
            </span>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
              {t("Creative Technology & AI")}
            </h3>
            <p className="mx-auto max-w-2xl text-slate-600 leading-relaxed">
              {t("Combining an experienced designer's eye with generative AI, interactive prototyping and AI-assisted development.")}
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {creativeCapabilities.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <GlassCard className="h-full p-6 sm:p-8" intensity="medium" gradient>
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className={feature.icon === "sparkles"
                        ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-900/10 ring-1 ring-white/30"
                        : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-blue-900/10 ring-1 ring-white/30"}
                    >
                      <SkillCategoryIcon name={feature.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {t(feature.eyebrow)}
                      </p>
                      <h4 className="text-lg font-semibold leading-snug text-slate-800 sm:text-xl">
                        {t(feature.title)}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    {t(feature.description)}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-violet-200/50 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 sm:text-sm"
                      >
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassCard
            className="p-8 text-center"
            intensity="medium"
            gradient
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              {t("Tools & Technologies")}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    z: 5,
                    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                  }}
                  className="px-4 py-2 bg-white/60 border border-white/40 text-slate-700 rounded-full text-sm font-medium hover:bg-white/80 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300 cursor-default"
                >
                  {t(tool)}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Skills;
