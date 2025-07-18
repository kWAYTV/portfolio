import { BookOpen, FolderOpen, HomeIcon } from 'lucide-react';

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
  '/projects': {
    name: 'projects',
    icon: FolderOpen,
    tooltip: 'View my projects'
  }
} satisfies NavItems;
