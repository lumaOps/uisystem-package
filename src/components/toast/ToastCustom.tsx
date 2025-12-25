import { toast } from '@/hooks/ui/use-toast';
import { cn } from '@/utils/utils';
import { ShowCustomToastProps } from '@/types/common/toast/toastCustom';
import { ToastAction } from './toast';
import DynamicIconLucide from '../dynamic-icon-lucide/DynamicIconLucide';

export const CustomToast = ({
  title,
  description,
  variant = 'default',
  withAction = false,
  actionText = 'Close',
  ActionClassName = '',
  onActionClick,
  position = 'top',
  duration = 2000,
}: ShowCustomToastProps) => {
  const positionClass =
    position === 'middle'
      ? 'top-1/2 transform -translate-y-1/2'
      : position === 'bottom'
        ? 'bottom-4'
        : 'top-4';

  const toastInstance = toast({
    title: (variant === 'success' ? (
      <div className="flex items-center">
        <DynamicIconLucide
          iconName="CircleCheck"
          className="w-4 h-4 mr-2 text-chart-6 rounded-full"
        />{' '}
        {title}
      </div>
    ) : variant === 'destructive' ? (
      <div className="flex items-center">
        <DynamicIconLucide
          iconName="CircleX"
          className="w-4 h-4 mr-2 text-destructive rounded-full"
        />{' '}
        {title}
      </div>
    ) : (
      <div>{title}</div>
    )) as string & React.ReactNode,
    description: <div className={variant !== 'default' ? 'ms-6' : ''}>{description}</div>,
    variant,
    duration,
    className: cn('fixed right-1 w-full md:max-w-[420px]', positionClass),
    action: withAction ? (
      <ToastAction
        altText={actionText}
        className={cn(
          ActionClassName,
          variant === 'destructive'
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-background text-foreground'
        )}
        onClick={onActionClick}
      >
        {actionText}
      </ToastAction>
    ) : undefined,
  });
  return toastInstance;
};
