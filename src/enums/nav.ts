import { BookOpen, GithubIcon, HomeIcon, MenuIcon } from 'lucide-react';

import type { NavItems } from '@/types/nav';

export const navItems: NavItems = {
  '/': {
    name: 'home',
    icon: HomeIcon,
    tooltip: 'Go to the home page'
  },
  '/blog': {
    name: 'blog',
    icon: BookOpen,
    tooltip: 'Explore my blog'
  },
  'https://github.com/kWAYTV': {
    name: 'github',
    icon: GithubIcon,
    tooltip: 'Take a look at my GitHub profile'
  }
} satisfies NavItems;
