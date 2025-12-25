export type ConfirmationVariant = 'destructive' | 'warning' | 'info' | 'default';

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: ConfirmationVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
  classNameContent?: string;
  preventClose?: boolean;
  showIcon?: boolean;
}
