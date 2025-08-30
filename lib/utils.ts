import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const portfolioItems = [
  {
    id: 'bigfun',
    title: 'BIGFUN',
    category: 'Branding',
    image: '/Essets/BIGFUN.jpg',
    detailImage: '/Essets/BIGFUN_in.jpg',
    description: 'Creative branding and logo design for entertainment brand'
  },
  {
    id: 'hakameri-brochure',
    title: 'HAKAMERI Brochure',
    category: 'Print Design',
    image: '/Essets/BROCHURE HAKAMERI.jpg',
    detailImage: '/Essets/BROCHURE HAKAMERI_inside.jpg',
    description: 'Professional brochure design with elegant layout and typography'
  },
  {
    id: 'roar-brochure',
    title: 'ROAR Brochure',
    category: 'Print Design',
    image: '/Essets/BROCHURE ROAR.jpg',
    detailImage: '/Essets/BROCHURE ROAR_inside.jpg',
    description: 'Dynamic brochure design with bold visual elements'
  },
  {
    id: 'company-redesign',
    title: 'Company Redesign',
    category: 'Brand Identity',
    image: '/Essets/COMPANY REDESIGN.jpg',
    detailImage: '/Essets/COMPANY REDESIGN_inside.jpg',
    description: 'Complete brand identity overhaul and modernization'
  },
  {
    id: 'digital-painting',
    title: 'Digital Painting',
    category: 'Digital Art',
    image: '/Essets/DIGITAL PAINTING.jpg',
    detailImage: '/Essets/DIGITAL PAINTING_inside.jpg',
    description: 'Original digital artwork showcasing artistic skills'
  },
  {
    id: 'gesture-poster',
    title: 'Gesture Poster',
    category: 'Poster Design',
    image: '/Essets/GESTURE POSTER.jpg',
    detailImage: '/Essets/GESTURE POSTER_inside.jpg',
    description: 'Expressive poster design with dynamic composition'
  },
  {
    id: 'grind',
    title: 'GRIND',
    category: 'Branding',
    image: '/Essets/GRIND.jpg',
    detailImage: '/Essets/GRIND_in.jpg',
    description: 'Urban brand identity with street aesthetic'
  },
  {
    id: 'kameri',
    title: 'KAMERI',
    category: 'Branding',
    image: '/Essets/KAMERI.jpg',
    detailImage: '/Essets/KAMERI_in.jpg',
    description: 'Sophisticated brand identity for cultural institution'
  },
  {
    id: 'keren-nails',
    title: 'Keren Nails Logo',
    category: 'Logo Design',
    image: '/Essets/KEREN NAILS LOGO.jpg',
    detailImage: '/Essets/KEREN NAILS LOGO_inside.jpg',
    description: 'Elegant logo design for beauty salon'
  },
  {
    id: 'landing-prototype',
    title: 'Landing Page Prototype',
    category: 'UI/UX Design',
    image: '/Essets/LANDING PAGE PROTOTYPE.png',
    detailImage: '/Essets/LANDING.png',
    description: 'Interactive landing page prototype with modern design'
  },
  {
    id: 'passportogo',
    title: 'PASSPORTOGO',
    category: 'Logo Design',
    image: '/Essets/PASSPORTOGO LOGO DESIGN.png',
    detailImage: '/Essets/PASSPORTOGO LOGO DESIGN_inside.jpg',
    description: 'Travel-themed logo design with global appeal'
  },
  {
    id: 'sketch-work',
    title: 'Sketch Work',
    category: 'Illustration',
    image: '/Essets/sketch.jpg',
    detailImage: '/Essets/SKETCH_IN.jpg',
    description: 'Hand-drawn sketches and conceptual illustrations'
  },
  {
    id: 'sketchbook',
    title: 'Sketchbook',
    category: 'Illustration',
    image: '/Essets/SKETCHBOOK.jpg',
    detailImage: '/Essets/SKETCHBOOK_inside.jpg',
    description: 'Collection of creative sketches and ideas'
  },
  {
    id: 'space-logo',
    title: 'SPACE Logo',
    category: 'Logo Design',
    image: '/Essets/SPACE LOGO.jpg',
    detailImage: '/Essets/SPACE LOGO_inside.jpg',
    description: 'Futuristic logo design with space theme'
  },
  {
    id: 'grind-logo',
    title: 'The GRIND Logo',
    category: 'Logo Design',
    image: '/Essets/THE GRIND LOGO.jpg',
    detailImage: '/Essets/THE GRIND LOGO_inside.jpg',
    description: 'Bold logo design for fitness brand'
  },
  {
    id: 'twitchy-rabbit',
    title: 'Twitchy Rabbit Logo',
    category: 'Logo Design',
    image: '/Essets/TWITCHY RABBIT LOGO.jpg',
    detailImage: '/Essets/TWITCHY RABBIT LOGO_inside.jpg',
    description: 'Playful character-based logo design'
  },
  {
    id: 'william',
    title: 'WILLIAM',
    category: 'Portrait',
    image: '/Essets/WILLIAM.jpg',
    detailImage: '/Essets/WILLIAM_in.jpg',
    description: 'Professional portrait illustration'
  }
]

export const skills = [
  'Brand Identity Design',
  'Logo Design',
  'Digital Painting',
  'UI/UX Design',
  'Print Design',
  'Illustration',
  'Typography',
  'Layout Design',
  'Branding Strategy',
  'Visual Storytelling'
]
