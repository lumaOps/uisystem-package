import type { ToasterProps as SonnerToasterProps } from 'sonner';

export type ToasterProps = SonnerToasterProps & {
  durationValue?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  btnActionClassName?: string;
  btnCancelClassName?: string;
};
