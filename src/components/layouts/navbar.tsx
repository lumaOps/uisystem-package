'use client';
import React from 'react';
import { SidebarTrigger } from '@/components/sidebar/sidebar';
import { NavbarActions } from '@/components/navbar/navbar-actions';
import { ThemeSwitch } from './themeSwitch';
import DynamicBreadCrumb from '@/components/breadcrumb/DynamicBreadCrumb';
import { LocaleSwitcher } from '@/components/translate-switcher/LocaleSwitcher';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  return (
    <nav className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <DynamicBreadCrumb />
      </div>

      <div className="flex items-center gap-2">
        {/* <EnvironmentBadge /> */}
        <NavbarActions />
        <LocaleSwitcher />
        <ThemeSwitch />
      </div>
    </nav>
  );
}
