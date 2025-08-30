"use client";

import React, { useState } from "react";
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

// Types
interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  detailImage: string;
  tags: string[];
  figmaUrl?: string;
  isPrototype?: boolean;
  highlights?: string[];
  deliverables?: string[];
  tools?: string[];
}

// Portfolio Data Structure
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "BIGFUN",
    category: "Branding",
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
    id: 2,
    title: "HAKAMERI Brochure",
    category: "Print Design",
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
    id: 3,
    title: "ROAR Brochure", 
    category: "Print Design",
    description: "High‑impact brochure built around bold typography and strong color blocking. The pacing alternates full‑bleed imagery with concise copy for a confident, energetic brand voice.",
    image: "/Essets/BROCHURE ROAR.jpg",
    detailImage: "/Essets/BROCHURE ROAR_inside.jpg",
    tags: ["Print Design", "Brochure", "Marketing"],
    highlights: [
      "Full‑bleed hero spreads",
      "Large headline system for short, punchy copy",
      "Color blocking to guide the eye"
    ],
    deliverables: ["Brochure master file", "Print PDF", "Color palette spec"],
    tools: ["InDesign", "Illustrator"]
  },
  
  {
    id: 5,
    title: "Digital Painting",
    category: "Digital Art",
    description: "Illustrative concept piece painted in a layered workflow with textured brushes and soft lighting. Focus on mood, color harmony, and painterly details across characters and environment.",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    tags: ["Digital Art", "Painting", "Illustration"],
    highlights: ["Atmospheric lighting", "Textured brushwork", "Color scripting"],
    deliverables: ["High‑res PNG", "Process timelapse frames"],
    tools: ["Photoshop", "Procreate"]
  },
  {
    id: 6,
    title: "Gesture Poster",
    category: "Poster Design",
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
    id: 7,
    title: "THE GRIND",
    category: "Branding",
    description: "Brand concept for a craft coffee venture: custom wordmark, badge system, and packaging direction. Emphasis on bold typography and tactile applications suitable for cups, stickers, and signage.",
    image: "/Essets/GRIND.jpg",
    detailImage: "/Essets/GRIND_in.jpg",
    tags: ["Branding", "Logo", "Identity"],
    highlights: ["Custom lettering", "Badge/secondary marks", "Packaging mockups"],
    deliverables: ["Logo suite", "Cup/sticker artwork", "Color/typography spec"],
    tools: ["Illustrator", "Photoshop"]
  },
  {
    id: 8,
    title: "Keren Nails Logo",
    category: "Logo Design",
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
    category: "UI/UX Design",
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
    category: "Logo Design",
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
    category: "Illustration",
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
    category: "Logo Design",
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
    category: "Logo Design",
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
    category: "Logo Design",
    description: "Energetic mascot character tailored for gaming/streaming contexts. Strong silhouette and expressive features make it instantly recognizable as an avatar.",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    tags: ["Logo Design", "Character", "Playful"],
    highlights: ["Mascot with strong silhouette", "Expressive facial features", "Avatar‑ready"],
    deliverables: ["Logo/mascot files", "Profile/header assets"],
    tools: ["Illustrator", "Photoshop"]
  },
  
  
];

const categories = ["All", "Branding", "Logo Design", "Print Design", "Digital Art", "UI/UX Design", "Illustration", "Portrait"];

interface PortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioModal = ({ item, isOpen, onClose }: PortfolioModalProps) => {
  if (!item) return null;

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
            <GlassCard
              className="w-full max-w-6xl h-full max-h-[90vh] p-6 lg:p-8 overflow-y-auto relative"
              intensity="heavy"
              gradient
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300 shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white text-xl">×</span>
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
                        title={`${item.title} - Interactive Prototype`}
                      />
                    ) : (
                      <div className="w-full max-h-[70vh] lg:max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <Image
                          src={item.detailImage}
                          alt={item.title}
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
                      {item.category}
                    </span>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      {item.description}
                    </p>
                    {item.isPrototype && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-medium text-sm">Interactive Prototype</span>
                        </div>
                        <p className="text-green-600 text-sm">
                          Click and interact with the prototype on the left to explore the full user experience.
                        </p>
                      </div>
                    )}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Highlights</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {item.highlights.map((h, i) => (
                            <li key={i} className="text-sm">{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Deliverables</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {item.deliverables.map((d, i) => (
                            <li key={i} className="text-sm">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.tools && item.tools.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Tools</h4>
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
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
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
            </GlassCard>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

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
            Portfolio
          </span>
          <Heading level={2} className="mb-6">
            Featured Work
          </Heading>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore my collection of creative projects spanning branding, digital art, 
            and visual design across various industries and mediums.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white/60 border border-white/40 text-slate-700 hover:bg-white/80 hover:animate-[focus-pulse_0.3s_ease-in-out]"
              }`}
              whileHover={{ 
                scale: 1.02, 
                z: 5,
                transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
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
                onClick={() => openModal(item)}
                className="cursor-pointer group"
              >
                <GlassCard
                  className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300"
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
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-600 rounded text-xs font-medium">
                            {item.category}
                          </span>
                          {item.isPrototype && (
                            <span className="inline-block px-2 py-1 bg-green-600 rounded text-xs font-medium">
                              Interactive
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold">
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                        {item.category}
                      </span>
                      {item.isPrototype && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Live</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {item.description}
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
            Like what you see? Let&apos;s create something amazing together.
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
            Start Your Project
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
