"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Section, 
  Container, 
  Heading, 
  GlassCard,
  PremiumButton,
  animations
} from "@/components/DesignSystem";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/Ilan-Sastiel/61570651904704/?locale=he_IL",
    icon: "/Essets/FACEBOOK_LOGO.png",
    color: "hover:text-blue-600"
  },
  {
    name: "Instagram", 
    href: "https://www.instagram.com/art_and_hp/",
    icon: "/Essets/INSTEGRAM_LOGO.png",
    color: "hover:text-pink-600"
  }
];

const contactInfo = [
  {
    title: "Let's Collaborate",
    description: "Ready to bring your vision to life? I'm always excited to work on new creative projects.",
    icon: "💡"
  },
  {
    title: "Quick Response",
    description: "I typically respond to all inquiries within 24 hours during business days.",
    icon: "⚡"
  },
  {
    title: "Professional Service",
    description: "From concept to completion, I ensure every project meets the highest standards.",
    icon: "🎯"
  }
];

export const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission (replace with actual form submission logic)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="py-20 lg:py-32" background="gradient">
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          {...animations.fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            Contact
          </span>
          <Heading level={2} className="mb-6">
            Let&apos;s Create Something Amazing
          </Heading>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it. 
            Let&apos;s discuss how we can bring your vision to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            {...animations.fadeInLeft}
          >
            <GlassCard
              className="p-8"
              intensity="medium"
              gradient
            >
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">
                Send me a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:animate-[focus-pulse_0.3s_ease-in-out] transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:animate-[focus-pulse_0.3s_ease-in-out] transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Project inquiry, collaboration, etc."
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:animate-[focus-pulse_0.3s_ease-in-out] transition-all duration-300 resize-none"
                    placeholder="Tell me about your project, ideas, timeline, and any specific requirements..."
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ 
                    scale: 1.018, 
                    z: 5,
                    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PremiumButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </PremiumButton>
                </motion.div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-100 text-green-700 rounded-xl text-center"
                  >
                    ✅ Message sent successfully! I&apos;ll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 text-red-700 rounded-xl text-center"
                  >
                    ❌ Something went wrong. Please try again or contact me directly.
                  </motion.div>
                )}
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info & Social */}
          <motion.div
            {...animations.fadeInRight}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard
                    className="p-6 hover:scale-[1.02] transition-transform duration-300"
                    intensity="medium"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">
                          {info.title}
                        </h4>
                        <p className="text-slate-600 leading-relaxed">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard
                className="p-6"
                intensity="medium"
                gradient
              >
                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                  Connect with me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 bg-white/40 rounded-xl hover:bg-white/60 hover:animate-[focus-pulse_0.3s_ease-in-out] transition-all duration-300 group",
                        social.color
                      )}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2, 
                        z: 5,
                        transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img 
                        src={social.icon} 
                        alt={social.name}
                        className="w-6 h-6"
                      />
                      <span className="font-medium text-slate-700 group-hover:text-inherit transition-colors duration-300">
                        {social.name}
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Follow me on social media for behind-the-scenes content, 
                    design tips, and the latest updates on my creative journey.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard
                className="p-6 text-center"
                intensity="light"
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">
                    Available for new projects
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Currently accepting new client work for Q1 2025
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default Contact;
