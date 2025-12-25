import { AlertCustomType } from '@/types/common/alert/alertCustom';
import { Alert, AlertDescription, AlertTitle } from './alert';
import DynamicIconLucide from '@/components/dynamic-icon-lucide/DynamicIconLucide';

export const AlertCustom: React.FC<AlertCustomType> = ({
  title,
  description,
  icon = 'Terminal', // default icon name as string
  variant = 'default',
  containerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <Alert variant={variant} className={`w-full h-16 bg-background ` + containerClassName}>
      {icon && <DynamicIconLucide iconName={icon} className="mt-0.5 flex-shrink-0" />}
      <AlertTitle className={`font-medium ` + titleClassName}>{title}</AlertTitle>
      {description && (
        <AlertDescription className={`font-normal ` + descriptionClassName}>
          {description}
        </AlertDescription>
      )}
    </Alert>
  );
};
