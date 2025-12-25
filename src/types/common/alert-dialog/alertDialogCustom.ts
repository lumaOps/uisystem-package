export interface CustomAlertDialogProps {
  triggerText: string;
  title: string;
  description: string;
  cancelText: string;
  actionText: string;
  onAction: () => void;
  ContentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  cancelButtonClassName?: string;
  actionButtonClassName?: string;
  vertical?: boolean;
}
