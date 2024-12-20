'use client';

import { useEffect, useRef } from 'react';

interface TabTitleChangerProps {
  awayTitle?: string;
}

export function TabTitleChanger({
  awayTitle = "I'm a lonely tab :("
}: TabTitleChangerProps) {
  const originalTitle = useRef<string>();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        originalTitle.current = document.title;
        document.title = awayTitle;
      } else {
        document.title = originalTitle.current ?? document.title;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [awayTitle]);

  return null;
}
