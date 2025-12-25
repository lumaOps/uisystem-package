import { cn } from '@/utils/utils';
import { Copy } from 'lucide-react';
import React, { useCallback } from 'react';

interface CopyButtonProps {
  onCopy?: () => void;
  textToCopy?: string;
  className?: string;
}

export default function CopyCustom({ onCopy, textToCopy, className = '' }: CopyButtonProps) {
  const defaultCopy = useCallback(() => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    } else {
      console.warn('No onCopy or textToCopy provided to CopyCustom.');
    }
  }, [textToCopy]);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onCopy) {
        onCopy();
      } else {
        defaultCopy();
      }
    },
    [onCopy, defaultCopy]
  );

  return (
    <Copy
      onClick={handleCopy}
      className={cn(
        'h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
    />
  );
}
