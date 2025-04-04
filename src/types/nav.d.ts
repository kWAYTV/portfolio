import { type LucideIcon } from 'lucide-react';

export type NavPath = '/' | '/blog';

export type NavItem = {
  name: string;
  icon: LucideIcon;
  tooltip: string;
};

export type NavItems = Record<NavPath, NavItem>;
