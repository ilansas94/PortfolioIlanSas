"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumButton, GlassCard } from "@/components/DesignSystem";
import { NavLogo } from "@/components/AnimatedLogo";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" }
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleSectionInView = () => {
      const sections = navigationItems.map(item => item.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleSectionInView);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleSectionInView);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "py-1" : "py-2"
        )}
      >
        <div className="container mx-auto px-6">
          <GlassCard
            className={cn(
              "px-6 py-2 transition-all duration-300",
              isScrolled ? "backdrop-blur-xl" : "backdrop-blur-md"
            )}
            intensity={isScrolled ? "heavy" : "medium"}
            gradient={true}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("#home")}
                className="cursor-pointer"
              >
                <NavLogo />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                      activeSection === item.href.substring(1)
                        ? "text-blue-600"
                        : "text-slate-700 hover:text-blue-600"
                    )}
                    whileHover={{ 
                      scale: 1.02, 
                      z: 5,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    {activeSection === item.href.substring(1) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden lg:block">
                <PremiumButton
                  variant="primary"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                >
                  Let&apos;s Work Together
                </PremiumButton>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden relative w-6 h-6 focus:outline-none"
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute top-0 left-0 w-full h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 8 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-2 left-0 w-full h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-4 left-0 w-full h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -8 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
          </GlassCard>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-6 right-6 z-40 lg:hidden"
          >
            <GlassCard intensity="heavy" gradient={true} className="p-6">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "text-left px-4 py-3 text-lg font-medium transition-colors duration-300 rounded-xl",
                      activeSection === item.href.substring(1)
                        ? "text-blue-600 bg-blue-50/50"
                        : "text-slate-700 hover:text-blue-600 hover:bg-white/20"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.018, 
                      z: 5,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="pt-4 border-t border-white/20"
                >
                  <PremiumButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => scrollToSection("#contact")}
                  >
                    Let&apos;s Work Together
                  </PremiumButton>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
