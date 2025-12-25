'use client';

import * as React from 'react';
import { Progress } from './progress';
import { ProgressCustomProps } from '@/types/common/progress/progress';

export function ProgressCustom({
  initialValue = 0,
  targetValue = 100,
  duration = 500,
  className,
  indicatorClassName,
}: ProgressCustomProps) {
  const [progress, setProgress] = React.useState(initialValue);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(targetValue), duration);
    return () => clearTimeout(timer);
  }, [targetValue, duration]);

  return (
    <Progress value={progress} className={className} indicatorClassName={indicatorClassName} />
  );
}
