'use client';

import { motion } from 'motion/react';

export function Description() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='mb-4'
    >
      {`I'm a (neo)Vim enthusiast and tab advocate, finding unmatched efficiency in
      (neo)Vim's keystroke commands and tabs' flexibility for personal viewing
      preferences. This extends to my support for static typing, where its
      early error detection ensures cleaner code, and my preference for dark
      mode, which eases long coding sessions by reducing eye strain.`}
    </motion.p>
  );
}
