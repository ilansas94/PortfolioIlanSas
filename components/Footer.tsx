"use client";

import React from "react";
import { motion } from "framer-motion";
import { FooterLogo } from "@/components/AnimatedLogo";
import { Section, Container, GlassCard } from "@/components/DesignSystem";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL",
    icon: "/Essets/FACEBOOK_LOGO.png"
  },
  {
    name: "Instagram", 
    href: "https://www.instagram.com/art_and_hp/",
    icon: "/Essets/INSTEGRAM_LOGO.png"
  }
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" }
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToSection = (href: string) => {
  const element = document.getElementById(href.substring(1));
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const Footer = () => {
  return (
    <Section className="py-16" background="gradient">
      <Container size="xl">
        <GlassCard
          className="p-8 lg:p-12"
          intensity="medium"
          gradient
        >
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <motion.div
                onClick={scrollToTop}
                className="cursor-pointer inline-block"
                whileHover={{ 
                  scale: 1.02, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FooterLogo />
              </motion.div>
              <p className="text-slate-600 leading-relaxed mt-4">
                Creative designer and digital artist passionate about bringing ideas to life 
                through innovative design and compelling visual experiences.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.05, 
                      z: 5,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={social.icon} 
                      alt={social.name}
                      className="w-5 h-5"
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={index}
                    onClick={() => scrollToSection(link.href)}
                    className="block text-slate-600 hover:text-blue-600 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Get In Touch
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>Ready to bring your vision to life?</p>
                <p>Let&apos;s create something amazing together.</p>
                <motion.button
                  onClick={() => scrollToSection("#contact")}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                  whileHover={{ 
                  scale: 1.02, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Project
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-8 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Ilan Sastiel. All rights reserved. 
              Designed and developed with passion.
            </p>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
};

export default Footer;
