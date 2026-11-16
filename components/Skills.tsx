"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Section, 
  Container, 
  Heading, 
  GlassCard,
  animations
} from "@/components/DesignSystem";

const skillCategories = [
  {
    title: "Design & Branding",
    skills: ["Logo Design", "Brand Identity", "Visual Identity", "Brand Guidelines"],
    color: "blue"
  },
  {
    title: "Digital Art",
    skills: ["Digital Painting", "Illustration", "Character Design", "Concept Art"],
    color: "purple"
  },
  {
    title: "UI/UX Design",
    skills: ["User Interface", "User Experience", "Prototyping", "Wireframing"],
    color: "emerald"
  },
  {
    title: "Print & Media",
    skills: ["Brochure Design", "Poster Design", "Campaign Design", "Print Layout"],
    color: "pink"
  }
];

const tools = [
  "Adobe Creative Suite",
  "Figma",
  "Sketch", 
  "Procreate",
  "Blender",
  "After Effects",
  "Photoshop",
  "Illustrator",
  "ChatGPT"
];

export const Skills = () => {
  return (
    <Section id="skills" className="py-20 lg:py-32" background="gradient">
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          {...animations.fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            Skills & Services
          </span>
          <Heading level={2} className="mb-6">
            What I Bring to the Table
          </Heading>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive skill set spanning digital design, traditional art, and modern technology 
            to create compelling visual experiences.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard
                className="p-6 h-full group hover:scale-[1.02] transition-transform duration-300"
                intensity="medium"
                gradient
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${
                  category.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  category.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  category.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                  'from-pink-500 to-pink-600'
                } shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {category.title}
                </h3>

                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (skillIndex * 0.05) }}
                      className="flex items-center space-x-2"
                    >
                      <div className={`w-2 h-2 rounded-full bg-${category.color}-500`}></div>
                      <span className="text-sm text-slate-600">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>


        {/* AI-Enhanced Workflow Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-6 md:p-8" intensity="medium" gradient>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-3">
                  Creative AI
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3">
                  AI-Assisted Creative Workflow
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  I blend professional design expertise with generative AI to explore ideas,
                  develop concepts, and refine visual directions. AI expands the creative
                  process; human judgment shapes the final result.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-sm">
                {["Prompt Engineering", "Visual Research", "Concept Development", "Creative Iteration"].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/70 border border-purple-200/60 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassCard
            className="p-8 text-center"
            intensity="medium"
            gradient
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              Tools & Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool, index) => (
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
                  className="px-4 py-2 bg-white/60 border border-white/40 text-slate-700 rounded-full text-sm font-medium hover:bg-white/80 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-colors duration-300 cursor-default"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Skills;
