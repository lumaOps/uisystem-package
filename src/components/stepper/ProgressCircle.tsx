import React, { useMemo } from 'react';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { ProgressCircleProps } from '@/modules/auth/types/sign-up/sign-up';

const ProgressCircle: React.FC<ProgressCircleProps> = React.memo(
  ({ currentStep, totalSteps, size = 'w-20 h-20', strokeWidth = 5, isSignupComplete = false }) => {
    const t = useCustomTranslation();

    const circleCalculations = useMemo(() => {
      const progressPercentage = (currentStep / totalSteps) * 100;
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference * (1 - progressPercentage / 100);

      return {
        progressPercentage,
        radius,
        circumference,
        strokeDashoffset,
      };
    }, [currentStep, totalSteps]);

    const { radius, circumference, strokeDashoffset } = circleCalculations;

    return (
      <div className={`relative ${size}`}>
        <svg
          className={`w-full h-full -rotate-90 text-muted stroke-[${strokeWidth}]`}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" className="stroke-slate-400" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={isSignupComplete ? 'stroke-green-500' : 'stroke-primary'}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Step counter text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-semibold">
            {currentStep} {t('Of')} {totalSteps}
          </span>
        </div>
      </div>
    );
  }
);

ProgressCircle.displayName = 'ProgressCircle';

export default ProgressCircle;
