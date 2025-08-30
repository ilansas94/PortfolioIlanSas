"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Section, 
  Container, 
  Heading, 
  PremiumButton, 
  FloatingElement,
  animations 
} from "@/components/DesignSystem";
import { HeroLogo } from "@/components/AnimatedLogo";

const scrollToSection = (href: string) => {
  const element = document.getElementById(href.substring(1));
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    // Auto fade out after 5 seconds
    const autoFadeTimer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 5000);

    // Fade out on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(autoFadeTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      background="gradient"
    >
      {/* Background Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement
          className="top-20 left-10"
          size="lg"
          color="blue"
          delay={0}
        />
        <FloatingElement
          className="top-32 right-20"
          size="md"
          color="purple"
          delay={1.5}
        />
        <FloatingElement
          className="bottom-40 left-20"
          size="sm"
          color="emerald"
          delay={3}
        />
        <FloatingElement
          className="bottom-20 right-32"
          size="lg"
          color="pink"
          delay={2.5}
        />
        <FloatingElement
          className="top-1/2 left-1/4"
          size="sm"
          color="blue"
          delay={4}
        />
        <FloatingElement
          className="top-1/3 right-1/3"
          size="md"
          color="purple"
          delay={5}
        />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <HeroLogo />
          </motion.div>

          {/* Main Heading */}
          <motion.div
            {...animations.fadeInUp}
            transition={{ ...animations.fadeInUp.transition, delay: 0.5 }}
          >
            <Heading level={1} gradient className="mb-6 font-display">
              Creative Designer
              <br />
              Digital Artist
            </Heading>
          </motion.div>

          {/* Subheading */}
          <motion.p
            {...animations.fadeInUp}
            transition={{ ...animations.fadeInUp.transition, delay: 0.7 }}
            className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Bringing ideas to life through innovative design, compelling branding, 
            and stunning visual experiences that captivate and inspire.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...animations.fadeInUp}
            transition={{ ...animations.fadeInUp.transition, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <PremiumButton
              variant="primary"
              size="lg"
              onClick={() => scrollToSection("#portfolio")}
              className="min-w-[200px]"
            >
              View My Work
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("#contact")}
              className="min-w-[200px]"
            >
              Get In Touch
            </PremiumButton>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showScrollIndicator ? 1 : 0, 
              y: showScrollIndicator ? 0 : 20 
            }}
            transition={{ 
              duration: showScrollIndicator ? 0.8 : 0.5,
              delay: showScrollIndicator ? 1.2 : 0 
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => scrollToSection("#about")}
            >
              <span className="text-sm text-slate-500 mb-2 font-medium">
                Scroll to explore
              </span>
              <motion.div
                className="w-6 h-10 rounded-full border-2 border-slate-400 flex justify-center"
                whileHover={{ 
                  scale: 1.05, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
              >
                <motion.div
                  className="w-1 h-3 bg-slate-400 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />
    </Section>
  );
};

export default Hero;
