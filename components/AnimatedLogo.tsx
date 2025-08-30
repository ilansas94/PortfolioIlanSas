"use client";

import React, { useRef, useEffect, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import logoAnimationData from "@/Essets/LOGO.json";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  autoplay?: boolean;
  loop?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const AnimatedLogo = React.forwardRef<HTMLDivElement, AnimatedLogoProps>(({
  className,
  size = "md",
  autoplay = true,
  loop = true,
  hover = true,
  onClick
}, ref) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32",
    xl: "w-48 h-48",
    "2xl": "w-64 h-64"
  };

  const handleMouseEnter = () => {
    if (hover) {
      setIsHovered(true);
      if (lottieRef.current) {
        lottieRef.current.setSpeed(1.5);
      }
    }
  };

  const handleMouseLeave = () => {
    if (hover) {
      setIsHovered(false);
      if (lottieRef.current) {
        lottieRef.current.setSpeed(1);
      }
    }
  };

  const handleClick = () => {
    if (lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.play();
    }
    onClick?.();
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "inline-block cursor-pointer select-none",
        sizes[size],
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={hover ? { 
        scale: 1.05, 
        z: 5,
        transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
      } : undefined}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={logoAnimationData}
        autoplay={autoplay}
        loop={loop}
        style={{ 
          width: "100%", 
          height: "100%",
          filter: isHovered ? "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))" : undefined,
          transition: "filter 0.3s ease"
        }}
        onComplete={() => {
          if (!loop && lottieRef.current) {
            // Reset to a specific frame or restart if needed
            lottieRef.current.goToAndStop(0);
          }
        }}
      />
    </motion.div>
  );
});

AnimatedLogo.displayName = "AnimatedLogo";

// Additional logo variants for different contexts
export const HeroLogo = () => (
  <AnimatedLogo
    size="2xl"
    className="mx-auto mb-8 drop-shadow-2xl"
    hover={true}
  />
);

export const NavLogo = () => (
  <AnimatedLogo
    size="md"
    className="transition-all duration-300 scale-110"
    hover={true}
  />
);

export const FooterLogo = () => (
  <AnimatedLogo
    size="md"
    className="opacity-70 hover:opacity-100 transition-opacity duration-300"
    hover={false}
  />
);

export default AnimatedLogo;
