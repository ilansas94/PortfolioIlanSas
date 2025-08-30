"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingElement } from "@/components/DesignSystem";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElement
        className="top-10 left-10"
        size="lg"
        color="blue"
        delay={0}
      />
      <FloatingElement
        className="top-20 right-20"
        size="md"
        color="purple"
        delay={2}
      />
      <FloatingElement
        className="bottom-32 left-20"
        size="sm"
        color="pink"
        delay={1}
      />
      <FloatingElement
        className="bottom-20 right-10"
        size="lg"
        color="emerald"
        delay={3}
      />

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
  );
}
