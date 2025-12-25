import { MenuItem } from '@/modules/website/types/api/manage-menu/manage-menu';
import type { DragEndEvent } from '@dnd-kit/core';

export interface DragEndParams {
  event: DragEndEvent;
  setMenuItems: (items: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void;
  findItemById: (items: MenuItem[], id: string) => MenuItem | null;
  findParentItem: (items: MenuItem[], childId: string) => MenuItem | null;
  isTopLevelItem: (items: MenuItem[], id: string) => boolean;
}
