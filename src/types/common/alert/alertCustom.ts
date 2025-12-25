export interface AlertCustomType {
  title: string;
  description?: string;
  icon?: string;
  variant?: 'destructive' | 'default';
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}
