"use client";

import React from "react";
import { LanguageProvider } from "@/lib/i18n";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";


export default function HomePage() {
  return (
    <LanguageProvider>
    <div id="portfolio-site" className="relative min-h-screen overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Contact />
      <Footer />
    </div>
    </LanguageProvider>
  );
}
