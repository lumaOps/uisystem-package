import { cn } from '@/utils/utils';
import { Loader2 } from 'lucide-react';

export function LoadingCustom({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'h-full flex flex-col items-center justify-center bg-background',
        containerClassName
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={cn('w-12 h-12 animate-spin text-primary', className)} />
      </div>
    </div>
  );
}
