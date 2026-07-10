export type TransitionKind = "print" | "ink" | "ui";

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  detailImage: string;
  tags: string[];
  highlights: string[];
  deliverables: string[];
  tools: string[];
  transition: TransitionKind;
  figmaUrl?: string;
};

export const projects: Project[] = [
  {
    id: 2,
    title: "Company Redesign",
    category: "Branding",
    description:
      "Playful identity for a youth initiative featuring a celebratory splash icon and a bilingual wordmark. The system extends to stationery, event shirts, and social posts with a bright, optimistic palette.",
    image: "/Essets/BIGFUN.jpg",
    detailImage: "/Essets/BIGFUN_in.jpg",
    tags: ["Branding", "Logo Design", "Identity"],
    highlights: [
      "Energetic color system suitable for youth audiences",
      "Bilingual wordmark for Hebrew and English contexts",
      "Flexible confetti motif used across applications",
    ],
    deliverables: [
      "Primary and secondary logos",
      "Stationery and social templates",
      "Event collateral artwork",
    ],
    tools: ["Illustrator", "Photoshop"],
    transition: "print",
  },
  {
    id: 3,
    title: "HAKAMERI Brochure",
    category: "Print Design",
    description:
      "A clean multi-page brochure designed on a strict grid with generous white space, edited copy, and image-first spreads. Prepared press-ready with bleeds and CMYK color management.",
    image: "/Essets/BROCHURE HAKAMERI.jpg",
    detailImage: "/Essets/BROCHURE HAKAMERI_inside.jpg",
    tags: ["Print Design", "Brochure", "Layout"],
    highlights: [
      "Twelve-page layout with a consistent rhythm",
      "CMYK and ink-limit checks for offset printing",
      "Grid-based typography with clear hierarchy",
    ],
    deliverables: ["Print-ready PDF", "Source files", "Press proof guidance"],
    tools: ["InDesign", "Photoshop"],
    transition: "print",
  },
  {
    id: 5,
    title: "Digital Painting",
    category: "Digital Art",
    description:
      "An illustrative concept piece painted in a layered workflow with textured brushes and soft lighting, focused on mood, color harmony, and painterly details.",
    image: "/Essets/DIGITAL PAINTING.jpg",
    detailImage: "/Essets/DIGITAL PAINTING_inside.jpg",
    tags: ["Digital Art", "Painting", "Illustration", "Portrait"],
    highlights: ["Atmospheric lighting", "Textured brushwork", "Color scripting"],
    deliverables: ["High-resolution artwork", "Process frames"],
    tools: ["Photoshop", "Procreate"],
    transition: "ink",
  },
  {
    id: 6,
    title: "Gesture Poster",
    category: "Poster Design",
    description:
      "An exploration of motion through expressive line work and layered textures, designed for large-format printing with attention to contrast and visual rhythm.",
    image: "/Essets/GESTURE POSTER.jpg",
    detailImage: "/Essets/GESTURE POSTER_inside.jpg",
    tags: ["Poster", "Design", "Art"],
    highlights: ["Dynamic composition", "Texture overlays", "Large-format optimization"],
    deliverables: ["Print PDF", "Large-format artwork"],
    tools: ["Illustrator", "Photoshop"],
    transition: "print",
  },
  {
    id: 8,
    title: "Keren Nails Logo",
    category: "Logo Design",
    description:
      "A clean, feminine mark for a beauty studio, balanced for signage, appointment cards, and social profile usage.",
    image: "/Essets/KEREN NAILS LOGO.jpg",
    detailImage: "/Essets/KEREN NAILS LOGO_inside.jpg",
    tags: ["Logo Design", "Beauty", "Branding"],
    highlights: ["Soft curves", "Small-size clarity", "Simple color system"],
    deliverables: ["Logo files", "Card and sign layouts"],
    tools: ["Illustrator"],
    transition: "print",
  },
  {
    id: 9,
    title: "Landing Page Prototype",
    category: "UI/UX Design",
    description:
      "A responsive landing page for a mini-course with a clear offer, syllabus, pricing, testimonials, and clickable Figma flows.",
    image: "/Essets/LANDING PAGE PROTOTYPE.png",
    detailImage: "/Essets/LANDING.png",
    tags: ["UI/UX", "Web Design", "Prototype"],
    highlights: ["Above-the-fold clarity", "Responsive constraints", "Clickable flows"],
    deliverables: ["Figma prototype", "Style tokens", "Asset exports"],
    tools: ["Figma"],
    transition: "ui",
    figmaUrl:
      "https://www.figma.com/proto/ymSXBm9a0tVh8VRAI62r3R/Landing-Page-%E2%80%93-Mini-Graphic-Course?content-scaling=fixed&embed-host=share&kind=proto&node-id=1-3&page-id=0%3A1&scaling=scale-down&theme=light&version=2",
  },
  {
    id: 10,
    title: "PASSPORTOGO",
    category: "Logo Design",
    description:
      "A friendly travel mark combining motion and direction cues, built to remain legible from app icon scale to printed collateral.",
    image: "/Essets/PASSPORTOGO.png",
    detailImage: "/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg",
    tags: ["Logo Design", "Travel", "Branding"],
    highlights: ["Motion cues", "Arrow symbolism", "Icon-first system"],
    deliverables: ["Logo pack", "Icon set"],
    tools: ["Illustrator"],
    transition: "print",
  },
  {
    id: 11,
    title: "Sketchbook",
    category: "Illustration",
    description:
      "Selected pages from ongoing studies in anatomy, objects, composition, and quick visual ideation.",
    image: "/Essets/SKETCHBOOK.jpg",
    detailImage: "/Essets/SKETCHBOOK_inside.jpg",
    tags: ["Illustration", "Sketch", "Concept"],
    highlights: ["Gesture studies", "Object analysis", "Composition thumbnails"],
    deliverables: ["Curated page selections", "Process snapshots"],
    tools: ["Pencil", "Ink", "Procreate"],
    transition: "ink",
  },
  {
    id: 13,
    title: "SPACE Logo",
    category: "Logo Design",
    description:
      "A modern mark inspired by orbits and negative space, designed to work on dark backgrounds and scale cleanly from favicon to signage.",
    image: "/Essets/SPACE LOGO.jpg",
    detailImage: "/Essets/SPACE LOGO_inside.jpg",
    tags: ["Logo Design", "Space", "Modern"],
    highlights: ["Negative-space motif", "Dark-mode system", "Wide scale range"],
    deliverables: ["Logo files", "Usage guidance"],
    tools: ["Illustrator"],
    transition: "ui",
  },
  {
    id: 14,
    title: "THE GRIND Logo",
    category: "Logo Design",
    description:
      "A robust primary badge for a coffee brand, designed for easy reproduction on cups, stickers, and merchandise.",
    image: "/Essets/THE GRIND LOGO.jpg",
    detailImage: "/Essets/THE GRIND LOGO_inside.jpg",
    tags: ["Logo Design", "Bold", "Branding"],
    highlights: ["Condensed forms", "One-color production", "Sticker-ready silhouette"],
    deliverables: ["Logo pack", "Merchandise layouts"],
    tools: ["Illustrator"],
    transition: "print",
  },
  {
    id: 15,
    title: "Twitchy Rabbit Logo",
    category: "Logo Design",
    description:
      "An energetic mascot tailored for gaming and streaming contexts, built around a strong silhouette and expressive features.",
    image: "/Essets/TWITCHY RABBIT LOGO.jpg",
    detailImage: "/Essets/TWITCHY RABBIT LOGO_inside.jpg",
    tags: ["Logo Design", "Character", "Playful"],
    highlights: ["Strong silhouette", "Expressive character", "Avatar-ready"],
    deliverables: ["Logo and mascot files", "Profile and header assets"],
    tools: ["Illustrator", "Photoshop"],
    transition: "ink",
  },
];
