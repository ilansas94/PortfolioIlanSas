"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Section, 
  Container, 
  Heading, 
  GlassCard,
  PremiumButton,
  animations
} from "@/components/DesignSystem";

const skills = [
  "Digital Painting",
  "Branding & Identity",
  "Logo Design", 
  "UI/UX Design",
  "Visual Storytelling",
  "Campaign Design",
  "Illustration",
  "Print Design"
];

const stats = [
  { number: "17+", label: "Creative Projects" },
  { number: "5+", label: "Years Experience" },
  { number: "100%", label: "Passion Driven" },
  { number: "∞", label: "Ideas & Counting" }
];

const scrollToSection = (href: string) => {
  const element = document.getElementById(href.substring(1));
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const About = () => {
  return (
    <Section id="about" className="py-20 lg:py-32" background="minimal">
      <Container size="xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <motion.div
            {...animations.fadeInLeft}
            className="order-2 lg:order-1"
          >
            <GlassCard
              className="p-8 group hover:scale-[1.02] transition-transform duration-500"
              intensity="medium"
              gradient
            >
              <div className="relative">
                <motion.div
                  className="relative w-full aspect-square rounded-3xl overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    z: 5,
                    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/Essets/passport.jpg"
                    alt="Ilan Sastiel - Creative Designer"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-2 gap-4 mt-6"
                >
                  {stats.map((stat, index) => (
                    <GlassCard
                      key={index}
                      className="p-4 text-center"
                      intensity="light"
                    >
                      <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {stat.number}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {stat.label}
                        </div>
                      </motion.div>
                    </GlassCard>
                  ))}
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            {...animations.fadeInRight}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  About Me
                </span>
              </motion.div>

              <Heading level={2} className="mb-6">
                Passionate Multidisciplinary Designer
              </Heading>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  I&apos;m <strong className="text-slate-800">Ilan Sastiel</strong>, a passionate multidisciplinary designer who loves creating meaningful, beautiful visuals.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  My background includes digital painting, branding, logo design, and user interface mockups. I&apos;m not just about the art – I&apos;m also a thinker, a planner, and a storyteller.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  My journey includes hands-on experience with everything from intuitive sketching to sleek landing pages and full campaign identity systems.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  I strive to craft projects that are both functional and inspiring. I&apos;m currently exploring how to combine my love for storytelling and interactivity in digital products.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-slate-800 font-medium"
                >
                  This portfolio is a reflection of my dedication, creativity, and constant curiosity. Thanks for stopping by!
                </motion.p>
              </div>
            </div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Core Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.02, 
                      z: 5,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-slate-700 rounded-full text-sm font-medium hover:from-blue-100 hover:to-purple-100 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={() => scrollToSection("#portfolio")}
              >
                View My Work
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={() => scrollToSection("#contact")}
              >
                Let&apos;s Connect
              </PremiumButton>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
