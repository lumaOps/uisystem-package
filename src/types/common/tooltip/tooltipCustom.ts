export type TooltipCustomProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  contentClassName?: string;
  delayDuration?: number;
};
