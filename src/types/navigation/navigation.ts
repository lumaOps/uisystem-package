import { LucideIcon } from 'lucide-react';

export interface BaseNavItem {
  title: string;
  url: string;
  allowRecent?: boolean;
  selectedRoute?: string | string[];
}

export interface NavSubItem extends BaseNavItem {
  items?: NavSubItem[];
}

export interface NavItem extends BaseNavItem {
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface RecentNavigationItem {
  title: string;
  url: string;
  icon: string;
  isPinned: boolean;
  lastVisited: number;
}
