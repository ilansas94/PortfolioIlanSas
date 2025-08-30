"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Design System Foundation
export const designTokens = {
  colors: {
    primary: {
      50: "rgb(240, 249, 255)",
      100: "rgb(224, 242, 254)",
      200: "rgb(186, 230, 253)",
      300: "rgb(125, 211, 252)",
      400: "rgb(56, 189, 248)",
      500: "rgb(14, 165, 233)",
      600: "rgb(2, 132, 199)",
      700: "rgb(3, 105, 161)",
      800: "rgb(7, 89, 133)",
      900: "rgb(12, 74, 110)"
    },
    neutral: {
      50: "rgb(248, 250, 252)",
      100: "rgb(241, 245, 249)",
      200: "rgb(226, 232, 240)",
      300: "rgb(203, 213, 225)",
      400: "rgb(148, 163, 184)",
      500: "rgb(100, 116, 139)",
      600: "rgb(71, 85, 105)",
      700: "rgb(51, 65, 85)",
      800: "rgb(30, 41, 59)",
      900: "rgb(15, 23, 42)"
    },
    accent: {
      purple: "rgb(147, 51, 234)",
      pink: "rgb(236, 72, 153)",
      emerald: "rgb(16, 185, 129)",
      amber: "rgb(245, 158, 11)"
    }
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "5xl": "8rem"
  },
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem"
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["Clash Display", "Inter", "system-ui", "sans-serif"]
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem"
    }
  }
};

// Glass Effect Component
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  gradient?: boolean;
  hover?: boolean;
  mpid?: string;
}
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  intensity = "medium",
  gradient = false,
  hover = true
}, ref) => {
  const intensityClasses = {
    light: "backdrop-blur-md bg-white/20 border-white/20",
    medium: "backdrop-blur-xl bg-white/30 border-white/30",
    heavy: "backdrop-blur-2xl bg-white/40 border-white/40"
  };
  const baseClasses = cn(
    "border rounded-3xl shadow-2xl relative overflow-hidden", 
    "transition-all duration-500 ease-out",
    "transform-gpu will-change-transform backface-hidden",
    intensityClasses[intensity], 
    gradient && "bg-gradient-to-br from-white/40 via-white/30 to-white/20",
    className
  );
  const hoverVariants = {
    initial: { 
      scale: 1,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      z: 0
    },
    hover: {
      scale: 1.018,
      y: -3,
      rotateY: 0.8,
      rotateX: 0.8,
      z: 20,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween"
      }
    }
  };

  const hoverProps = hover ? {
    variants: hoverVariants,
    initial: "initial",
    animate: "initial",
    whileHover: "hover",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  } : {};
  return <motion.div ref={ref} className={baseClasses} {...hoverProps}>
        {children}
      </motion.div>;
});
GlassCard.displayName = "GlassCard";

// Premium Button Component
export interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  mpid?: string;
}
export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  type = "button"
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl",
    secondary: "backdrop-blur-xl bg-white/30 border border-white/40 text-slate-700 hover:bg-white/40",
    ghost: "text-slate-700 hover:bg-white/20"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const buttonVariants = {
    initial: { 
      scale: 1,
      z: 0
    },
    hover: {
      scale: disabled ? 1 : 1.03,
      z: disabled ? 0 : 10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween"
      }
    },
    tap: {
      scale: disabled ? 1 : 0.97,
      z: disabled ? 0 : 5
    }
  };

  return <motion.button 
    ref={ref} 
    className={cn(
      "font-medium rounded-2xl transition-all duration-300 relative overflow-hidden", 
      "focus:outline-none focus:ring-2 focus:ring-blue-500/50", 
      "disabled:opacity-50 disabled:cursor-not-allowed", 
      variants[variant], 
      sizes[size], 
      className
    )} 
    onClick={onClick} 
    disabled={disabled}
    type={type} 
    variants={buttonVariants} 
    initial="initial" 
    animate="initial" 
    whileHover="hover" 
    whileTap="tap" 
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 30
    }}
  >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700" initial={{
      opacity: 0
    }} whileHover={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} />}
  </motion.button>;
});
PremiumButton.displayName = "PremiumButton";

// Typography Components
export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean;
  className?: string;
  mpid?: string;
}
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({
  children,
  level = 1,
  gradient = false,
  className
}, ref) => {
  const levelClasses = {
    1: "text-5xl md:text-7xl lg:text-8xl font-light tracking-tight",
    2: "text-4xl md:text-5xl lg:text-6xl font-light",
    3: "text-3xl md:text-4xl font-medium",
    4: "text-2xl md:text-3xl font-medium",
    5: "text-xl md:text-2xl font-medium",
    6: "text-lg md:text-xl font-medium"
  };

  // Create the component based on level
  const componentProps = {
    ref,
    className: cn(levelClasses[level], gradient ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" : "text-slate-800", className),
    children
  };
  switch (level) {
    case 1:
      return <h1 {...componentProps} />;
    case 2:
      return <h2 {...componentProps} />;
    case 3:
      return <h3 {...componentProps} />;
    case 4:
      return <h4 {...componentProps} />;
    case 5:
      return <h5 {...componentProps} />;
    case 6:
      return <h6 {...componentProps} />;
    default:
      return <h1 {...componentProps} />;
  }
});
Heading.displayName = "Heading";

// Floating Elements
export const FloatingElement = ({
  className,
  size = "md",
  color = "blue",
  delay = 0
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "purple" | "pink" | "emerald";
  delay?: number;
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  const colors = {
    blue: "from-blue-400 to-cyan-400",
    purple: "from-purple-400 to-violet-400",
    pink: "from-pink-400 to-rose-400",
    emerald: "from-emerald-400 to-teal-400"
  };
  return <motion.div className={cn("absolute rounded-full opacity-60", `bg-gradient-to-r ${colors[color]}`, sizes[size], className)} animate={{
    y: [0, -10, 0],
    scale: [1, 1.1, 1],
    rotate: [0, 180, 360]
  }} transition={{
    duration: 6 + delay,
    repeat: Infinity,
    ease: "easeInOut",
    delay
  }} />;
};

// Section Container
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "gradient" | "minimal";
  mpid?: string;
}
export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  children,
  className,
  id,
  background = "default"
}, ref) => {
  const backgroundClasses = {
    default: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30",
    gradient: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
    minimal: "bg-white"
  };
  return <section ref={ref} id={id} className={cn("relative py-20 lg:py-32", backgroundClasses[background], className)}>
        {children}
      </section>;
});
Section.displayName = "Section";

// Container
export const Container = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}>(({
  children,
  className,
  size = "lg"
}, ref) => {
  const sizeClasses = {
    sm: "max-w-4xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl"
  };
  return <div ref={ref} className={cn("container mx-auto px-6 lg:px-8", sizeClasses[size], className)}>
      {children}
    </div>;
});
Container.displayName = "Container";

// Animation Presets
export const animations = {
  fadeInUp: {
    initial: {
      opacity: 0,
      y: 50
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  fadeInLeft: {
    initial: {
      opacity: 0,
      x: -50
    },
    animate: {
      opacity: 1,
      x: 0
    },
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  fadeInRight: {
    initial: {
      opacity: 0,
      x: 50
    },
    animate: {
      opacity: 1,
      x: 0
    },
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  scaleIn: {
    initial: {
      opacity: 0,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};
export default {
  designTokens,
  GlassCard,
  PremiumButton,
  Heading,
  FloatingElement,
  Section,
  Container,
  animations
};
