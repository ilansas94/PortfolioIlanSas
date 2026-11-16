"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Section, 
  Container, 
  Heading, 
  GlassCard,
  PremiumButton,
  animations
} from "@/components/DesignSystem";
import { useLanguage } from "@/lib/i18n";
import { hebrewProjects } from "@/lib/portfolio-he";

const cardTagClass = "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700";

const filterCategories = [
  "All", "Branding", "Logo Design", "Print Design", "Digital Art",
  "UI/UX Design", "Illustration", "Portrait", "AI & Interactive"
] as const;

type FilterCategory = (typeof filterCategories)[number];
type ProjectCategory = Exclude<FilterCategory, "All"> | "Poster Design";

interface PortfolioItem {
  id: number;
  title: string;
  categories: [ProjectCategory, ...ProjectCategory[]];
  cardTags?: string[];
  description: string;
  image: string;
  detailImage: string;
  tags: string[];
  figmaUrl?: string;
  liveHref?: string;
  isPrototype?: boolean;
  highlights?: string[];
  deliverables?: string[];
  tools?: string[];
}

// Portfolio Data Structure
const portfolioItems: PortfolioItem[] = [
  {
    id: 16,
    title: "Safe Moments",
    categories: ["UI/UX Design", "AI & Interactive"],
    cardTags: ["AI-Assisted Development", "Interactive Learning"],
    description: "Built with OpenAI Codex, this independent Hebrew learning experience combines graphic design, UX design, and interactive development. An illustrated, animated patient room guides learners through the WHO Five Moments for Hand Hygiene and five practice scenarios.",
    image: "/learning-lab/portfolio-cover.webp",
    detailImage: "/learning-lab/portfolio-cover.webp",
    liveHref: "/learning-lab",
    isPrototype: true,
    tags: ["Learning Design", "Isometric Artwork", "Accessibility"],
    highlights: [
      "AI-assisted visual exploration for the illustrated patient room",
      "Interactive learning, animation, and responsive development with OpenAI Codex"
    ]
  },
  
  {
    id: 17,
    title: "FIRST SHIFT",
    categories: ["UI/UX Design", "AI & Interactive", "Branding"],
    cardTags: ["AI-Assisted Development", "Interactive Learning"],
    description: "An independent Hebrew onboarding concept for hospital employees, pairing an editorial visual identity with animated wayfinding, interactive workplace scenarios, and a coordinated welcome kit. Built as a responsive experience with AI-assisted development.",
    image: "/first-shift/portfolio-cover.svg",
    detailImage: "/first-shift/portfolio-cover.svg",
    liveHref: "/first-shift",
    isPrototype: true,
    tags: ["Brand Identity", "Motion Design", "Interactive Onboarding", "RTL"],
    highlights: [
      "Animated corridor illustration with a guided orange route and progressive milestones",
      "Interactive workplace decisions and an action-ordering exercise with feedback",
      "Responsive Hebrew-first experience tested in Chromium and WebKit"
    ],
    deliverables: [
      "Interactive employee-onboarding experience",
      "Branded welcome poster, journey infographic, and preparation checklist"
    ]
  },

  {
    id: 2,
    title: "Company Redesign",
    categories: ["Branding"],
    description: "Playful identity for a youth initiative featuring a celebratory splash icon and a bilingual wordmark. The system extends to stationery, event shirts, and social posts with a bright, optimistic palette.",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    tags: ["Branding", "Logo Design", "Identity"],
    highlights: [
      "Energetic color system suitable for youth audiences",
      "Bilingual wordmark for Hebrew and English contexts",
      "Flexible confetti motif used across applications"
    ],
    deliverables: [
      "Primary/secondary logos and lockups",
      "Stationery kit and social templates",
      "T‑shirt/event collateral artwork"
    ],
    tools: ["Illustrator", "Photoshop"]
  },
  {
    id: 3,
    title: "HAKAMERI Brochure",
    categories: ["Print Design"],
    description: "Clean multi‑page brochure designed on a strict grid with generous white space, edited copy, and image‑first spreads. Prepared press‑ready with bleeds, CMYK color management, and export specs for offset printing.",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    detailImage: "/Essets/BROCHURE HAKAMERI_inside.jpg",
    tags: ["Print Design", "Brochure", "Layout"],
    highlights: [
      "12‑page layout with consistent rhythm",
      "CMYK and ink‑limit checks for offset",
      "Grid‑based typography with clear hierarchy"
    ],
    deliverables: ["Print‑ready PDF", "Source files", "Press proof guidance"],
    tools: ["InDesign", "Photoshop"]
  },
  
  {
    id: 5,
    title: "Digital Painting",
    categories: ["Digital Art", "Illustration", "Portrait"],
    description: "Illustrative concept piece painted in a layered workflow with textured brushes and soft lighting. Focus on mood, color harmony, and painterly details across characters and environment.",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    tags: ["Digital Art", "Painting", "Illustration", "Portrait"],
    highlights: ["Atmospheric lighting", "Textured brushwork", "Color scripting"],
    deliverables: ["High‑res PNG", "Process timelapse frames"],
    tools: ["Photoshop", "Procreate"]
  },
  {
    id: 6,
    title: "Gesture Poster",
    categories: ["Poster Design"],
    description: "Exploration of motion through expressive line work and layered textures. Designed for large‑format printing with attention to contrast, viewing distance, and visual rhythm.",
    image: "/Essets/GESTURE POSTER.jpg",
    detailImage: "/Essets/GESTURE POSTER_inside.jpg",
    tags: ["Poster", "Design", "Art"],
    highlights: [
      "Dynamic composition",
      "Texture overlays for depth",
      "Optimized for A1/A2 formats"
    ],
    deliverables: ["Print PDF", "Large‑format PNG"],
    tools: ["Illustrator", "Photoshop"]
  },
  {
    id: 8,
    title: "Keren Nails Logo",
    categories: ["Logo Design"],
    description: "Clean, feminine mark for a beauty studio—balanced letterforms, subtle curves, and a neutral palette. Optimized for signage, appointment cards, and Instagram profile usage.",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    tags: ["Logo Design", "Beauty", "Branding"],
    highlights: ["Soft curves and legibility", "Small‑size clarity for avatars", "Simple color system"],
    deliverables: ["Logo files", "Card and sign layouts"],
    tools: ["Illustrator"]
  },
  {
    id: 9,
    title: "Landing Page Prototype",
    categories: ["UI/UX Design"],
    description: "Responsive landing page for a mini‑course: clear hero value prop, course syllabus highlights, pricing section, and testimonial carousel. Built in Figma with clickable flows for key CTAs.",
    image: "/Essets/LANDING PAGE PROTOTYPE.png",
    detailImage: "/Essets/LANDING.png",
    figmaUrl: "https://www.figma.com/proto/ymSXBm9a0tVh8VRAI62r3R/Landing-Page-%E2%80%93-Mini-Graphic-Course?content-scaling=fixed&embed-host=share&kind=proto&node-id=1-3&page-id=0%3A1&scaling=scale-down&theme=light&version=2",
    isPrototype: true,
    tags: ["UI/UX", "Web Design", "Prototype"],
    highlights: ["Above‑the‑fold clarity", "Trust indicators", "Responsive constraints"],
    deliverables: ["Figma prototype", "Style tokens", "Asset exports"],
    tools: ["Figma"]
  },
  {
    id: 10,
    title: "PASSPORTOGO",
    categories: ["Logo Design"],
    description: "Friendly travel mark that combines motion and direction cues—ideal for tickets, app icons, and social avatars. Designed to stay legible at small sizes.",
    image: "/Essets/PASSPORTOGO.png",
    detailImage: "/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg",
    tags: ["Logo Design", "Travel", "Branding"],
    highlights: ["Motion/speed cues", "Arrow/compass symbolism", "Icon‑first system"],
    deliverables: ["Logo pack", "Icon set"],
    tools: ["Illustrator"]
  },
  {
    id: 11,
    title: "Sketchbook",
    categories: ["Illustration"],
    description: "Selected pages from ongoing studies—anatomy, objects, and quick thumbnails. Focused on process, line economy, and ideation rather than polished finishes.",
    image: "/Essets/SKETCHBOOK.jpg",
    detailImage: "/Essets/SKETCHBOOK_inside.jpg",
    tags: ["Illustration", "Sketch", "Concept"],
    highlights: ["Gesture and figure studies", "Object analyses", "Thumbnails for composition"],
    deliverables: ["Curated page selections", "Process snapshots"],
    tools: ["Pencil", "Ink", "Procreate"]
  },
  {
    id: 13,
    title: "SPACE Logo",
    categories: ["Logo Design"],
    description: "Modern tech‑leaning mark inspired by orbits and negative space. Designed to work on dark backgrounds and to scale cleanly from favicon to signage.",
    image: "/Essets/SPACE LOGO.jpg",
    detailImage: "/Essets/SPACE LOGO_inside.jpg",
    tags: ["Logo Design", "Space", "Modern"],
    highlights: ["Negative‑space motif", "Dark‑mode friendly", "Scales from favicon to signage"],
    deliverables: ["Logo files", "Usage guidance"],
    tools: ["Illustrator"]
  },
  {
    id: 14,
    title: "THE GRIND Logo",
    categories: ["Logo Design"],
    description: "Primary badge for the coffee brand—robust letterforms and simple geometry for easy reproduction on cups, stickers, and merchandise.",
    image: "/Essets/THE GRIND LOGO.jpg",
    detailImage: "/Essets/THE GRIND LOGO_inside.jpg",
    tags: ["Logo Design", "Bold", "Branding"],
    highlights: ["Bold, condensed forms", "One‑color production‑ready", "Sticker‑friendly silhouette"],
    deliverables: ["Logo pack", "Sticker/merch layouts"],
    tools: ["Illustrator"]
  },
  {
    id: 15,
    title: "Twitchy Rabbit Logo",
    categories: ["Logo Design"],
    description: "Energetic mascot character tailored for gaming/streaming contexts. Strong silhouette and expressive features make it instantly recognizable as an avatar.",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    tags: ["Logo Design", "Character", "Playful"],
    highlights: ["Mascot with strong silhouette", "Expressive facial features", "Avatar‑ready"],
    deliverables: ["Logo/mascot files", "Profile/header assets"],
    tools: ["Illustrator", "Photoshop"]
  },
  
  
];

interface PortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioModal = ({ item, isOpen, onClose }: PortfolioModalProps) => {
  const { t, isHebrew } = useLanguage();
  const display = item ? { ...item, ...(isHebrew ? hebrewProjects[item.id] : {}) } : null;
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement;
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!item || !display) return null;

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          key="portfolio-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <motion.div
          key="portfolio-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-project-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onClose();
              return;
            }
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href], iframe");
            const first = controls[0];
            const last = controls[controls.length - 1];
            const destination = event.shiftKey && document.activeElement === first ? last
              : !event.shiftKey && document.activeElement === last ? first : null;
            if (destination) {
              event.preventDefault();
              destination.focus();
            }
          }}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.28, ease: [0.4, 0.0, 0.2, 1] }}
          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
            <div
              className="relative h-full max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                ref={closeButton}
                aria-label={t("Close project")}
                onClick={onClose}
                className="close-portfolio-project absolute top-6 right-6 z-20 w-10 h-10 bg-white text-slate-800 rounded-full flex items-center justify-center hover:bg-slate-100 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300 shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">×</span>
              </motion.button>

              <div className="grid lg:grid-cols-2 gap-8 h-full">
                {/* Image or Prototype */}
                <div className="relative">
                  <motion.div
                    className="relative w-full max-h-[70vh] lg:max-h-[80vh] rounded-xl overflow-hidden"
                    layoutId={`portfolio-image-${item.id}`}
                  >
                    {item.isPrototype && item.figmaUrl ? (
                      <iframe
                        src={item.figmaUrl}
                        className="w-full h-[70vh] lg:h-[80vh] rounded-xl border-0"
                        allowFullScreen
                        title={`${display.title} - Interactive Prototype`}
                      />
                    ) : (
                      <div className="w-full max-h-[70vh] lg:max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <Image
                          src={item.detailImage}
                          alt={display.title}
                          width={800}
                          height={1200}
                          className="w-full h-auto object-contain"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                      {t(item.categories[0])}
                    </span>
                    <h3 id="portfolio-project-title" className="text-3xl font-bold text-slate-800 mb-4">
                      {display.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      {display.description}
                    </p>
                    {item.liveHref && (
                      <a
                        href={item.liveHref}
                        className="mb-6 inline-flex min-h-11 items-center gap-3 rounded-xl bg-[#0b2a38] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#145063] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                      >
                        {t("Open the interactive lesson")} <span aria-hidden="true">{isHebrew ? "←" : "→"}</span>
                      </a>
                    )}
                    {item.isPrototype && item.figmaUrl && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-medium text-sm">{t("Interactive Prototype")}</span>
                        </div>
                        <p className="text-green-600 text-sm">
                          {t("Click and interact with the prototype on the left to explore the full user experience.")}
                        </p>
                      </div>
                    )}
                    {display.highlights && display.highlights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">{t("Highlights")}</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {display.highlights.map((h, i) => (
                            <li key={i} className="text-sm">{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {display.deliverables && display.deliverables.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">{t("Deliverables")}</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {display.deliverables.map((d, i) => (
                            <li key={i} className="text-sm">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.tools && item.tools.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">{t("Tools")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.tools.map((tool, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white/70 border border-white/50 rounded-full text-xs text-slate-700">{tool}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-3">
                      {t("Tags")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {display.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/60 border border-white/40 text-slate-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Portfolio = () => {
  const { t, isHebrew } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Defensive: ensure no duplicate titles appear (case-insensitive)
  const baseItems = useMemo(() => {
    const seenTitles = new Set<string>();
    const seenImages = new Set<string>();
    const seenDetailImages = new Set<string>();

    return portfolioItems.filter((item) => {
      const titleKey = item.title.trim().toLowerCase();
      const imageKey = (item.image || "").trim().toLowerCase();
      const detailKey = (item.detailImage || "").trim().toLowerCase();

      const isDup =
        seenTitles.has(titleKey) ||
        (imageKey && seenImages.has(imageKey)) ||
        (detailKey && seenDetailImages.has(detailKey));

      if (isDup) return false;

      seenTitles.add(titleKey);
      if (imageKey) seenImages.add(imageKey);
      if (detailKey) seenDetailImages.add(detailKey);
      return true;
    });
  }, []);

  const filteredItems = activeCategory === "All" 
    ? baseItems 
    : baseItems.filter(item => item.categories.includes(activeCategory));

  const openModal = (item: typeof portfolioItems[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Allow exit animation to play before unmounting content
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <Section id="portfolio" className="py-20 lg:py-32" background="minimal">
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          {...animations.fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            {t("Portfolio")}
          </span>
          <Heading level={2} className="mb-6">
            {t("Featured Work")}
          </Heading>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("Explore my collection of creative projects spanning branding, digital art, and visual design across various industries and mediums.")}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          role="group"
          aria-label={t("Filter projects by category")}
          className="portfolio-filter mx-auto mb-8 grid max-w-lg grid-cols-3 gap-1.5 max-[350px]:grid-cols-[1fr_1fr_1.2fr] sm:mb-12 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-2"
        >
          {filterCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1 py-2 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-3.5 sm:text-sm ${
                activeCategory === category
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white/60 text-slate-700 hover:bg-blue-50"
              }`}
              whileHover={{ 
                scale: 1.02, 
                z: 5,
                transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {category === "AI & Interactive" && (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0 sm:h-4 sm:w-4">
                  <path d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5L8 12l-5.5-2L8 8 10 2.5Z" />
                  <path d="M18.5 13v7m-3.5-3.5h7" />
                </svg>
              )}
              {t(category)}
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                role="button"
                tabIndex={0}
                aria-label={`${isHebrew ? "פתיחת פרויקט" : "Open"} ${isHebrew ? (hebrewProjects[item.id]?.title ?? item.title) : item.title}`}
                onClick={() => openModal(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(item);
                  }
                }}
                className="group cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                <GlassCard
                  className="overflow-hidden motion-safe:[@media(hover:hover)]:group-hover:scale-[1.02] transition-transform duration-300"
                  intensity="medium"
                  gradient
                  hover={false}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <motion.div
                      layoutId={`portfolio-image-${item.id}`}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={item.image}
                        alt={isHebrew ? (hebrewProjects[item.id]?.title ?? item.title) : item.title}
                        fill
                        className={item.liveHref
                          ? "bg-[#0b2a38] object-contain motion-safe:[@media(hover:hover)]:group-hover:scale-105 transition-transform duration-500"
                          : "object-cover object-center motion-safe:[@media(hover:hover)]:group-hover:scale-110 transition-transform duration-500"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className={cardTagClass}>
                        {t(item.categories[0])}
                      </span>
                      {item.isPrototype && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">{t("Live")}</span>
                        </div>
                      )}
                    </div>
                    {item.cardTags && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {item.cardTags.map(tag => (
                          <span key={tag} className={cardTagClass}>
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {isHebrew ? (hebrewProjects[item.id]?.title ?? item.title) : item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {isHebrew ? (hebrewProjects[item.id]?.description ?? item.description) : item.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-slate-600 mb-6">
            {t("Like what you see? Let's create something amazing together.")}
          </p>
          <PremiumButton
            variant="primary"
            size="lg"
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {t("Start Your Project")}
          </PremiumButton>
        </motion.div>
      </Container>

      {/* Portfolio Modal */}
      <PortfolioModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Section>
  );
};

export default Portfolio;
