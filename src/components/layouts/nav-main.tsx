'use client';

import { type LucideIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/sidebar/sidebar';

import DropdownMenuCustom from '@/components/dropdown-menu/DropdownMenuCustom';
import { itemMenu } from '@/types/common/dropdown-menu/dropdownMenu';
import type { NavItem } from '@/types/navigation/navigation';
import { useNavigationLogic } from '@/hooks/navigation/useNavigationLogic';
import { useNavigationStore } from '@/stores/navigation/useNavigationStore';
import { NAVIGATION_CONFIG, SIDEBAR_LABELS } from '@/config/base/navigation';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible/collapsible';

/**
 * SimpleMenuItem - Renders a basic menu item without nested submenus
 */
const SimpleMenuItem = ({
  title,
  url,
  Icon,
  open,
  isActive,
  isMobile,
  setOpenMobile,
}: {
  title: string;
  url: string;
  Icon?: LucideIcon;
  open: boolean;
  isActive?: boolean;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  const t = useCustomTranslation();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={!open ? t(title) : undefined}
        isActive={isActive}
        aria-label={t(title)}
      >
        <Link
          href={url}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span className="px-2">{t(title)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * CollapsedDropdownMenuItem - Renders a dropdown menu for collapsed sidebar state
 */
const CollapsedDropdownMenuItem = ({
  title,
  Icon,
  subItems,
  router,
}: {
  title: string;
  Icon?: LucideIcon;
  subItems: Array<{
    title: string;
    url: string;
    items?: itemMenu[];
  }>;
  router: ReturnType<typeof useRouter>;
}) => {
  const t = useCustomTranslation();
  const listMenu = useMemo(
    () => {
      return subItems.map(sub => ({
        label: t(sub.title),
        value: t(sub.title),
        onClick: () => router.push(sub.url),
      }));
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [subItems, router]
  );
  return (
    <SidebarMenuItem>
      <DropdownMenuCustom
        list_menu={listMenu}
        buttonText={t(title)}
        align="start"
        side="right"
        buttonIcon={Icon ? <Icon className="h-4 w-4" /> : null}
        triggerType="hover"
        customTrigger={
          <SidebarMenuButton aria-label={`${t(title)} menu`}>
            <span className="w-4 h-4 flex items-center justify-center">
              {Icon && <Icon className="h-4 w-4" />}
            </span>
          </SidebarMenuButton>
        }
      />
    </SidebarMenuItem>
  );
};

/**
 * ExpandedCollapsibleMenuItem - Renders a collapsible nested menu for expanded sidebar
 */
const ExpandedCollapsibleMenuItem = ({
  title,
  Icon,
  subItems,
  isActive,
  isMobile,
  setOpenMobile,
}: {
  title: string;
  Icon?: LucideIcon;
  subItems: Array<{
    title: string;
    url: string;
    selectedRoute?: string | string[];
    items?: itemMenu[];
  }>;
  isActive?: boolean;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  const navItems = useNavigationStore(state => state.navItems);
  const { hasActiveChild, isNavItemSelected } = useNavigationLogic(navItems);
  const t = useCustomTranslation();
  const isDefaultOpen = useMemo(() => {
    return isActive || hasActiveChild(subItems);
  }, [isActive, hasActiveChild, subItems]);

  return (
    <Collapsible asChild defaultOpen={isDefaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            isActive={false}
            aria-label={`Toggle ${t(title)} menu`}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{t(title)}</span>
            <ChevronRight
              className={`ml-auto ${NAVIGATION_CONFIG.CLASSES.TRANSITION_ALL} ${NAVIGATION_CONFIG.CLASSES.DURATION} group-data-[state=open]/collapsible:rotate-90`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map(sub => {
              const isSubActive = isNavItemSelected(sub);
              return (
                <SidebarMenuSubItem key={t(sub.title)}>
                  <SidebarMenuSubButton asChild isActive={isSubActive}>
                    <Link
                      href={sub.url}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      aria-label={t(sub.title)}
                    >
                      {t(sub.title)}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

/**
 * NavMain - Main navigation component that adapts to sidebar state
 */
export function NavMain({ items }: { items: NavItem[] }) {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const navItems = useNavigationStore(state => state.navItems);
  const { isNavItemSelected } = useNavigationLogic(navItems);
  const t = useCustomTranslation();
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(SIDEBAR_LABELS.PLATFORM)}</SidebarGroupLabel>
      <SidebarMenu>
        {memoizedItems.map(item => {
          const { title, url, icon: Icon, items: subItems = [] } = item;
          const hasSubItems = subItems.length > 0;
          const isActiveRoute = isNavItemSelected(item);

          if (!open && hasSubItems) {
            return (
              <CollapsedDropdownMenuItem
                key={t(title)}
                title={t(title)}
                Icon={Icon}
                subItems={subItems}
                router={router}
              />
            );
          }

          if (open && hasSubItems) {
            return (
              <ExpandedCollapsibleMenuItem
                key={t(title)}
                title={t(title)}
                Icon={Icon}
                subItems={subItems}
                isActive={isActiveRoute}
                isMobile={isMobile}
                setOpenMobile={setOpenMobile}
              />
            );
          }

          return (
            <SimpleMenuItem
              key={t(title)}
              title={t(title)}
              url={url}
              Icon={Icon}
              open={open}
              isActive={isActiveRoute}
              isMobile={isMobile}
              setOpenMobile={setOpenMobile}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
