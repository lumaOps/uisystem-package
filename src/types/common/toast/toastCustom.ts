export interface ShowCustomToastProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  withAction?: boolean;
  actionText?: string;
  ActionClassName?: string;
  onActionClick?: () => void;
  position?: string;
  duration?: number;
}
