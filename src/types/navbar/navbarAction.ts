import { ReactNode, MouseEventHandler, FocusEventHandler, KeyboardEventHandler } from 'react';

export interface NavbarAction {
  id?: string;
  label: string;
  icon?: ReactNode;
  buttonClassName?: string;
  customContent?: ReactNode; // New: for custom content
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  positionIcon?: 'left' | 'right';
  action?: () => void;
  url?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onBlur?: FocusEventHandler;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onKeyDown?: KeyboardEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
}

export type CreateCustomActionOptions = {
  content: React.ReactNode;
  onClick?: () => void;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  isLoading?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
};
