export type ItemType = 'default' | 'checkbox' | 'radio' | 'submenu';

export interface SubMenuItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  itemClassName?: string;
  onClick?: () => void;
  shortcut?: string;
}

export interface MenuItem {
  label: string;
  value: string;
  key?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  disabled?: boolean;
  itemClassName?: string;
  onClick?: () => void;
  checked?: boolean;
  shortcut?: string;
  submenu?: SubMenuItem[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
  type?: ItemType;
}
export interface itemMenu {
  title: string;
  url: string;
}

export interface DropdownCustomProps {
  // Menu items (can be a simple array or an array of sections)
  list_menu: MenuItem[] | MenuSection[];
  // Text for button that triggers dropdown
  buttonText?: string;
  // Width of dropdown menu
  menuWidth?: string;
  // Button variant (if using a variant system)
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  // Additional CSS classes for button
  buttonClassName?: string;
  // Disable button
  disabled?: boolean;
  // If true, list_menu is considered as an array of sections
  hasSections?: boolean;
  // Default type for menu items if not using sections
  itemType?: ItemType;
  // Align dropdown menu
  align?: 'start' | 'center' | 'end';
  // Callback when a selected option changes
  onSelectionChange?: (value: string | string[], sectionIndex?: number) => void;
  // Allow multiple selections for checkbox type
  allowMultiple?: boolean;
  // Side where the dropdown appears
  side?: 'top' | 'right' | 'bottom' | 'left';

  // Icon to appear after button text
  buttonIcon?: React.ReactNode;
  customTrigger: React.ReactNode;
  triggerType: string;
  customHeader?: React.ReactNode;
}
