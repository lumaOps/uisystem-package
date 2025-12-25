import { TabItem } from '@/modules/inventory/types/api/inventory';

export interface statusTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  disabled?: boolean;
}

export const vehicleTabs = [
  { id: '1', label: 'All Vehicles', count: 10, order: 1, checked: true },
  { id: '2', label: 'Published', count: 10, order: 2, checked: false },
  { id: '3', label: 'Sold', count: 10, order: 3, checked: false },
  { id: '4', label: 'Draft', count: 10, order: 4, checked: false },
  { id: '5', label: 'Archived', count: 10, order: 5, checked: false },
];
