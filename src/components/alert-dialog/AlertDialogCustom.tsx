import { CustomAlertDialogProps } from '@/types/common/alert-dialog/alertDialogCustom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { cn } from '@/utils/utils';
import { CustomButton } from '../button/CustomButton';

export const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  triggerText,
  title,
  description,
  cancelText,
  actionText,
  ContentClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  cancelButtonClassName = '',
  actionButtonClassName = '',
  vertical = false,
  onAction,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <CustomButton variant="outline">{triggerText}</CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent className={ContentClassName}>
        <AlertDialogHeader className={cn(vertical && 'flex flex-col items-center w-full')}>
          <AlertDialogTitle className={titleClassName}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClassName}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(vertical ? 'sm:flex-col-reverse gap-2' : 'sm:flex-row')}>
          <AlertDialogCancel className={cn(vertical ? 'w-full' : '', cancelButtonClassName)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction className={actionButtonClassName} onClick={onAction}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
