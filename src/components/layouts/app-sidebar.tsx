'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/sidebar/sidebar';
import { NavMain } from '@/components/layouts/nav-main';
import { NavRecent } from '@/components/layouts/nav-recent';
import { NavUser } from '@/components/layouts/nav-user';
import { useNavigationStore } from '@/stores/navigation/useNavigationStore';
import { accountStatus, UserProfile } from '@/modules/auth/types/auth/auth';
import SearchCustom from '@/components/search/SearchCustom';
import Logo from '@/components/logo/Logo';
import {
  REGISTRATION_KEY,
  useRegistrationStorage,
} from '@/modules/auth/hooks/storage/useRegistrationStorage';
import useCookies from '@/hooks/storage/useCookies';
import { authCookies } from '@/utils/helpers/cookies';
import { useRouter } from 'next/navigation';
import SkeletonCardProfile from '@/components/skeleton/SkeletonCardProfile';
import { cn } from '@/utils/utils';
import { useProfile } from '@/modules/auth/hooks/queries/sign-in/useAuth';
import { useNavigationConfigGlobal } from '@/hooks/navigation/useNavigationConfigGlobal';

/**
 * Logo configuration constants
 */
const LOGO_CONFIG = {
  LIGHT: '/logo/Logo-light.svg',
  DARK: '/logo/Logo.svg',
  MIN_LIGHT: '/logo/Logo-sm-light.svg',
  MIN_DARK: '/logo/Logo-sm.svg',
  WIDTH: 120,
  HEIGHT: 48,
} as const;

/**
 * Memoized Logo Component with hydration fix
 */
const SidebarLogo = React.memo(({ isOpen }: { isOpen: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = useMemo(() => {
    if (!mounted || !resolvedTheme) {
      return isOpen ? LOGO_CONFIG.LIGHT : LOGO_CONFIG.MIN_LIGHT;
    }

    if (isOpen) {
      return resolvedTheme === 'dark' ? LOGO_CONFIG.LIGHT : LOGO_CONFIG.DARK;
    }
    return resolvedTheme === 'dark' ? LOGO_CONFIG.MIN_LIGHT : LOGO_CONFIG.MIN_DARK;
  }, [isOpen, resolvedTheme, mounted]);

  return (
    <div className="flex justify-center items-center h-12">
      <Image
        src={logoSrc}
        alt="Logo"
        width={LOGO_CONFIG.WIDTH}
        height={LOGO_CONFIG.HEIGHT}
        className="h-auto w-auto"
        priority
      />
    </div>
  );
});

SidebarLogo.displayName = 'SidebarLogo';

/**
 * AppSidebar - Main sidebar component with optimized rendering and hydration fix
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Hooks
  const { data: profile } = useProfile();
  const { setCookie } = useCookies();
  const { editRegisterSignUpSelections, removeRegisterSignUpSelection } = useRegistrationStorage();
  const router = useRouter();
  const { open } = useSidebar();
  const { navItems } = useNavigationStore(state => state);

  // Apply config-based navigation filtering
  const { isLoading: isConfigLoading } = useNavigationConfigGlobal();

  // ⚠️ MOVE SIDE EFFECTS INTO useEffect
  useEffect(() => {
    if (profile) {
      const accessType = profile?.data?.company?.plan?.access?.type;

      if (accessType) {
        authCookies.setAccessType(accessType);

        if (accessType === accountStatus.PRE_ACTIVE) {
          editRegisterSignUpSelections(REGISTRATION_KEY.IS_REGISTRED, true);
          setCookie(REGISTRATION_KEY.REGISTRATION_DATA, 'true');
          router.push('/sign-up');
        } else {
          removeRegisterSignUpSelection('isRegistred');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  const { isMobile } = useSidebar();

  const memoizedNavItems = useMemo(() => {
    return navItems.map(item => {
      if (isConfigLoading[item.title]) {
        return { ...item, items: [] };
      }
      return item;
    });
  }, [navItems, isConfigLoading]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={cn('', isMobile && 'items-start justify-start pt-0 text-20')}>
        <Logo isOpen={open} />
      </SidebarHeader>

      <SidebarContent style={{ scrollbarWidth: 'none' }}>
        <div className="px-4">{open && <SearchCustom disabled={true} placeholder="Search" />}</div>
        <NavMain items={memoizedNavItems} />
        <NavRecent />
      </SidebarContent>

      <SidebarFooter>
        {profile ? (
          <NavUser profile={profile?.data as UserProfile} />
        ) : open ? (
          <SkeletonCardProfile />
        ) : (
          <></>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
