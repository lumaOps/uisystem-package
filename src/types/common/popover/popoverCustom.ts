export interface PopoverCustomProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
