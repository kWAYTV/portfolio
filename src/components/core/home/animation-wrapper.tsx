'use client';

import { motion } from 'motion/react';
import { type ReactNode } from 'react';

interface AnimationWrapperProps {
  children: ReactNode;
  direction?: 'up' | 'down';
  delay?: number;
}

export function AnimationWrapper({
  children,
  direction = 'up',
  delay = 0
}: AnimationWrapperProps) {
  const yValue = direction === 'up' ? 20 : -20;

  return (
    <motion.div
      initial={{ opacity: 0, y: yValue }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
