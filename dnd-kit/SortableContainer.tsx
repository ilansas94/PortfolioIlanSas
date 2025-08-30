"use client";

import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SortableContainerProps extends Omit<MotionProps, 'ref'> {
  children: React.ReactNode;
  dndKitId?: string;
  containerType?: string;
  prevTag?: string;
  className?: string;
}

export const SortableContainer = forwardRef<HTMLDivElement, SortableContainerProps>(
  ({ children, className, dndKitId, containerType, prevTag, ...motionProps }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

SortableContainer.displayName = "SortableContainer";
