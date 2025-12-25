import React from 'react';
import { Check, Circle, CircleDashed } from 'lucide-react';
import { cn } from '@/utils/utils';
import { HorizontalStepperProps } from '@/modules/website/types/setup/website';

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({ steps, currentStep, className }) => {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepIndex: number, status: string) => {
    if (status === 'completed') {
      return (
        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-background" />
        </div>
      );
    }
    if (status === 'current') {
      return (
        <div className="relative w-5 h-5">
          <Circle className="w-5 h-5 text-muted" />
          <div className="absolute inset-0 w-5 h-5">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                strokeDasharray="50.27"
                strokeDashoffset="40.22"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      );
    }
    if (status === 'upcoming') {
      return <CircleDashed className="w-5 h-5 text-border" />;
    }
    return null;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-1 bg-primary rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${Math.min(((currentStep + 1) / steps.length) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Step Circle and Title */}
              <div className="flex items-center gap-2">
                <div>{getStepIcon(index, status)}</div>
                <div
                  className={cn('text-sm font-medium transition-colors duration-300', {
                    'text-foreground': status === 'completed' || status === 'current',
                    'text-muted-foreground': status === 'upcoming',
                  })}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector Line (except for last step) */}
              {!isLast && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-muted -z-10" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalStepper;
