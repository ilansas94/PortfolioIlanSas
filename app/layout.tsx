import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ilan Sastiel | Creative Designer & Digital Artist",
  description: "Creative designer and digital artist specializing in branding, visual identity, digital art, and AI-assisted creative workflows. Explore selected design projects and visual concepts.",
  keywords: ["graphic design", "logo design", "branding", "digital art", "creative designer", "visual identity", "AI-assisted design", "generative AI", "Runway", "AI video", "portfolio"],
  authors: [{ name: "Ilan Sastiel" }],
  creator: "Ilan Sastiel",
  openGraph: {
    title: "Ilan Sastiel | Creative Designer & Digital Artist",
    description: "Creative designer and digital artist exploring branding, visual design, and AI-assisted creative workflows.",
    type: "website",
    locale: "en_US",
    siteName: "Ilan Sastiel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilan Sastiel | Creative Designer & Digital Artist",
    description: "Creative designer and digital artist exploring branding, visual design, and AI-assisted creative workflows.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" href="/learning-lab/heebo-hebrew.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen`}>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
