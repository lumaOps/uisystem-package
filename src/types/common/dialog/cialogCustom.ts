import { DialogContent } from '@radix-ui/react-dialog';

// Position du header
export type HeaderPosition = 'start' | 'center' | 'end';

// Props pour le composant CustomDialog
export interface DialogCustomProps {
  // Trigger est le composant qui ouvre le dialog
  trigger?: React.ReactNode;
  // Header et subHeader pour le contenu du haut
  header?: string;
  subHeader?: string;
  // Position du header (start, center ou end)
  headerPosition?: HeaderPosition;
  // ClassName pour le header
  headerClassName?: string;
  // Contenu principal du dialog
  children?: React.ReactNode;
  // Pied de page du dialog
  footer?: React.ReactNode;
  // Props supplémentaires du Dialog
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Props supplémentaires du DialogContent
  contentProps?: React.ComponentProps<typeof DialogContent>;
  // Empêcher la fermeture en cliquant à l'extérieur
  preventClose?: boolean;
  // Classe personnalisée pour le contenu du dialog
  className?: string;
  subHeaderClassName?: string;
  headerTitleClassName?: string;
}
