'use client';

import * as React from 'react';
import { Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [mounted, setMounted] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsChanging(true);
    // Small delay to allow animation to complete
    setTimeout(() => {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
      setIsChanging(false);
    }, 200);
  };

  if (!mounted) {
    return (
      <Button variant='linkHover2' className='flex items-center gap-2 p-2'>
        <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
        <span className='capitalize'>Loading</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant='linkHover2'
      className='flex items-center gap-2 p-2'
      aria-label='Toggle theme'
    >
      <div
        className={`flex items-center gap-2 ${isChanging ? 'animate-out fade-out zoom-out duration-200' : 'animate-in fade-in zoom-in duration-200'}`}
      >
        {currentTheme === 'dark' ? (
          <Sun className='h-4 w-4' aria-hidden='true' />
        ) : (
          <Moon className='h-4 w-4' aria-hidden='true' />
        )}
        <span className='capitalize'>
          {currentTheme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </div>
    </Button>
  );
}
