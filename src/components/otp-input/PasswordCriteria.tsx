'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordCriteriaDisplayProps {
  passwordValue: string | undefined;
  showCriteria: boolean;
  className?: string;
}

export function PasswordCriteriaDisplay({
  passwordValue,
  showCriteria,
  className,
}: PasswordCriteriaDisplayProps) {
  const t = useCustomTranslation();

  if (!showCriteria) {
    return null;
  }

  const passwordCriteria = [
    { id: 'length', text: 'At least 8 characters long', valid: (passwordValue?.length || 0) >= 8 },
    {
      id: 'uppercase',
      text: 'Must include at least one uppercase',
      valid: /[A-Z]/.test(passwordValue || ''),
    },
    {
      id: 'lowercase',
      text: 'Must include at least one lowercase',
      valid: /[a-z]/.test(passwordValue || ''),
    },
    {
      id: 'number',
      text: 'Must include at least one number',
      valid: /\d/.test(passwordValue || ''),
    },
    {
      id: 'special',
      text: 'Must include at least one special character (@$!%*?&)', // Clarified which special chars for the text
      valid: /[@$!%*?&]/.test(passwordValue || ''),
    },
  ];

  return (
    <div className={cn('grid gap-2 text-sm', className)}>
      {passwordCriteria.map(criterion => (
        <div
          key={criterion.id}
          className={cn(
            'flex items-center',
            criterion.valid ? 'text-muted-foreground' : 'text-destructive'
          )}
        >
          {criterion.valid ? (
            <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <XCircle className="mr-2 h-4 w-4 text-destructive" /> // Ensuring XCircle also gets text-destructive explicitly if needed
          )}
          {t(criterion.text)}
        </div>
      ))}
    </div>
  );
}
