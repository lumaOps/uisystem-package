import { Pin, X, TimerReset } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useRecentNavigation } from '@/hooks/navigation/useRecentNavigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from '@/components/sidebar/sidebar';
import { NAVIGATION_CONFIG, SIDEBAR_LABELS } from '@/config/base/navigation';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/tooltip';
import { useUpdateRecentPageMutation } from '@/hooks/queries/dynamic-forms/useDynamicFormsMutations';
import { useAuthStore } from '@/modules/auth/stores/sign-in/auth.store';
import { RecentPageSkeleton } from '../skeleton/recentPageSkeleton';

export function NavRecent() {
  const t = useCustomTranslation();
  const { recentItems, isLoading } = useRecentNavigation();
  const userId = useAuthStore(state => state.user?.id);
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const updateRecentPageMutation = useUpdateRecentPageMutation(userId ?? '');

  const handleTogglePin = useCallback(
    (id: string, currentPinned: boolean) => () => {
      updateRecentPageMutation.mutate({ id, isPinned: !currentPinned });
    },
    [updateRecentPageMutation]
  );

  const shouldRender = useMemo(() => {
    return (!isLoading && recentItems.length > 0 && !isCollapsed) || isLoading;
  }, [recentItems.length, isCollapsed, isLoading]);

  if (!shouldRender) return null;
  return (
    <div className="my-4 border-t border-sidebar-border p-2">
      <div className="p-2 text-xs font-medium text-sidebar-foreground/70">
        {t(SIDEBAR_LABELS.RECENT_NAVIGATIONS)}
      </div>
      <SidebarMenu className="space-y-1">
        {isLoading || updateRecentPageMutation.isPending
          ? Array.from({ length: 5 }).map((_, idx) => (
              <SidebarMenuItem key={idx} className="flex items-center gap-2 animate-pulse">
                <RecentPageSkeleton />
              </SidebarMenuItem>
            ))
          : recentItems.map(item => (
              <SidebarMenuItem
                key={item.url}
                className={`group/item ${NAVIGATION_CONFIG.CLASSES.TRANSITION_ALL} ${NAVIGATION_CONFIG.CLASSES.DURATION} ${NAVIGATION_CONFIG.TRANSITIONS.EASE_IN_OUT}`}
              >
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.title)}
                    className="flex items-center gap-1"
                    aria-label={t(item.title)}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-1"
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                    >
                      {item.isPinned ? <Pin /> : <TimerReset />}
                      <span className="px-3">{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>

                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuAction
                          onClick={handleTogglePin(item.id, item.isPinned)}
                          className={`h-5 w-5 p-0 hover:text-primary ${NAVIGATION_CONFIG.CLASSES.TRANSITION_ALL} ${NAVIGATION_CONFIG.CLASSES.DURATION} ${NAVIGATION_CONFIG.TRANSITIONS.EASE_IN_OUT} transform ${NAVIGATION_CONFIG.CLASSES.HOVER_SCALE}`}
                          aria-label={item.isPinned ? SIDEBAR_LABELS.UNPIN : SIDEBAR_LABELS.PIN}
                        >
                          {item.isPinned ? <X className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                        </SidebarMenuAction>
                      </TooltipTrigger>
                      <TooltipContent>
                        {item.isPinned ? SIDEBAR_LABELS.UNPIN : SIDEBAR_LABELS.PIN}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </div>
  );
}
