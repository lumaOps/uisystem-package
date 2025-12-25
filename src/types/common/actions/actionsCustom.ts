import { MenuItem } from '../dropdown-menu/dropdownMenu';

export interface ActionsCustomProps {
  /** Options for the action menu */
  actionOptions: MenuItem[];
  /** Callback triggered when an action is selected */
  onActionChange: (actionValue: string) => void;
  /** Text displayed on the button */
  buttonText?: string;
  /** Width of the dropdown menu */
  menuWidth?: string;
  /** Alignment of the dropdown menu */
  align?: 'start' | 'center' | 'end';
  /** Trigger type for the dropdown menu */
  triggerType?: 'click' | 'hover';

  /** Custom CSS classes for the container */
  className?: string;
  isDisabled?: boolean;
}
