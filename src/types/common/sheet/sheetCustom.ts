export interface CustomSheetProps {
  // Props existantes
  triggerText?: string | React.ReactNode;
  triggerContent?: React.ReactNode;
  title?: string;
  description?: string;
  content: React.ReactNode;
  footer?: boolean;
  ContentClassName?: string;
  ButtonClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  ButtonTriggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onSave?: () => void;
  onClose?: () => void;
  closeButtonText?: string;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  isSaveLoading?: boolean;
  isSaveDisabled?: boolean;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  actionButton?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCopyButton?: boolean;
  headerContent?: React.ReactNode;

  // Nouvelles props pour le footer flexible
  onSecondaryAction?: () => void; // Action secondaire (comme Back)
  secondaryButtonText?: string; // Texte du bouton secondaire
  shouldCloseOnSecondaryAction?: boolean; // Si l'action secondaire doit fermer le sheet
}
