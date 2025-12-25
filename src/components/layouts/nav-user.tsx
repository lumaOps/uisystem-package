'use client';

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/sidebar/sidebar';
import { UserProfile } from '@/modules/auth/types/auth/auth';
import { authCookies } from '@/utils/helpers/cookies';
import { useAuthStore } from '@/modules/auth/stores/sign-in/auth.store';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/storage/useLocalStorage';
import { useQueryClient } from '@tanstack/react-query';
import { useLogout } from '@/modules/auth/hooks/queries/sign-in/useAuthMutations';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import DropdownMenuCustom from '@/components/dropdown-menu/DropdownMenuCustom';
import { AvatarCustom } from '@/components/avatar/avatarCustom';

export function NavUser({ profile }: { profile: UserProfile }) {
  const logoutMutation = useLogout();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { clear } = useLocalStorage();
  const queryClient = useQueryClient();
  const t = useCustomTranslation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authCookies.removeCookiesOfLogout();
      clear();
      setUser(null);
      router.push('/login');
      //the layout might still be mounted for a few milliseconds before the redirect fully unmounts it.
      setTimeout(() => queryClient.clear(), 200);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!profile) return null;

  // Menu items
  const menuItems = [
    {
      value: 'account',
      label: t('Account'),
      icon: <BadgeCheck className="mr-2 h-4 w-4" />,
      onClick: () => console.log('Account clicked'),
    },
    {
      value: 'billing',
      label: t('Billing'),
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      onClick: () => console.log('Billing clicked'),
    },
    {
      value: 'notifications',
      label: t('Notifications'),
      icon: <Bell className="mr-2 h-4 w-4" />,
      onClick: () => console.log('Notifications clicked'),
    },
    {
      value: 'logout',
      label: logoutMutation.isPending ? t('Logging out') + '...' : t('Log out'),
      icon: <LogOut className="mr-2 h-4 w-4" />,
      onClick: handleLogout,
      disabled: logoutMutation.isPending,
    },
  ];

  const handleSelectionChange = (value: string | string[]) => {
    const item = menuItems.find(i => i.value === value);
    if (item?.onClick) item.onClick();
  };

  // Custom header
  const customHeader = (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <AvatarCustom
        image={profile?.avatar}
        alt={profile?.first_name}
        fallback={`${profile?.first_name?.[0]}${profile?.last_name?.[0]}`}
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {profile?.first_name} {profile?.last_name}
        </span>
        <span className="truncate text-xs">{profile?.email}</span>
        <span className="truncate text-xs font-bold mt-1">{profile?.id}</span>
      </div>
    </div>
  );

  // Custom trigger
  const customTrigger = (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <AvatarCustom
        image={profile?.avatar}
        alt={profile?.first_name}
        fallback={`${profile?.first_name?.[0]}${profile?.last_name?.[0]}`}
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {profile?.first_name} {profile?.last_name}
        </span>
        <span className="truncate text-xs">{profile?.email}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </SidebarMenuButton>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenuCustom
          list_menu={menuItems}
          itemType="default"
          triggerType="click"
          customTrigger={customTrigger}
          onSelectionChange={handleSelectionChange}
          buttonText=""
          buttonIcon={null}
          customHeader={customHeader}
          side={isMobile ? 'bottom' : 'right'}
          align="end"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
