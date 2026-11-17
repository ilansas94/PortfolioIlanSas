"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumButton } from "@/components/DesignSystem";
import { RefractiveNavigation } from "@/components/RefractiveNavigation";
import { NavLogo } from "@/components/AnimatedLogo";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" }
];

export const Navigation = () => {
  const { isHebrew, language, setLanguage, t } = useLanguage();
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const changeLanguage = () => setLanguage(language === "en" ? "he" : "en");

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
        <div className="container mx-auto px-4 sm:px-6">
          <RefractiveNavigation className="px-4 py-1.5 sm:px-6 sm:py-2">
            <div className="nav-layout grid grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
              {/* Logo */}
              <motion.button
                type="button"
                aria-label={t("Back to homepage")}
                whileHover={{
                  scale: 1.02,
                  z: 5,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("#home")}
                className="justify-self-start cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70"
              >
                <NavLogo />
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-5">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                      activeSection === item.href.substring(1)
                        ? "text-brand-800"
                        : "text-slate-700 hover:text-brand-800"
                    )}
                    whileHover={{ 
                      scale: 1.02, 
                      z: 5,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t(item.name)}
                    {activeSection === item.href.substring(1) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-600 to-magenta-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Desktop contact CTA and language switch */}
              <div className="hidden lg:flex items-center justify-self-end gap-3">
                <PremiumButton
                  variant="primary"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                >
                  {t("Let's Work Together")}
                </PremiumButton>
                <button type="button" onClick={changeLanguage}
                  aria-label={isHebrew ? "Switch to English" : "מעבר לעברית"}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300/80 bg-white/75 px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/></svg>
                  <span lang={isHebrew ? "en" : "he"}>{isHebrew ? "English" : "עברית"}</span>
                </button>
              </div>

              <div className="flex items-center justify-self-end gap-2 lg:hidden">
                <button type="button" onClick={changeLanguage}
                  aria-label={isHebrew ? "Switch to English" : "מעבר לעברית"}
                  className="inline-flex h-11 min-w-[65px] items-center justify-center gap-1.5 rounded-xl border border-slate-300/70 bg-white/75 px-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/></svg>
                  <span lang={isHebrew ? "en" : "he"}>{isHebrew ? "EN" : "עברית"}</span>
                </button>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden relative w-11 h-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70" aria-label={t(isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu")} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation-menu"
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute top-3 left-[10px] w-6 h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 8 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-5 left-[10px] w-6 h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-7 left-[10px] w-6 h-0.5 bg-slate-700 rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -8 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              </div>
            </div>
          </RefractiveNavigation>
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
            id="mobile-navigation-menu" className="fixed top-24 left-4 right-4 z-40 sm:left-6 sm:right-6 lg:hidden"
          >
            <RefractiveNavigation className="liquid-menu-panel p-6">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "text-start px-4 py-3 text-lg font-medium transition-colors duration-300 rounded-xl",
                      activeSection === item.href.substring(1)
                        ? "text-brand-800 bg-brand-50/70"
                        : "text-slate-700 hover:text-brand-800 hover:bg-white/20"
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
                    {t(item.name)}
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
                    {t("Let's Work Together")}
                  </PremiumButton>
                </motion.div>
              </div>
            </RefractiveNavigation>
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
