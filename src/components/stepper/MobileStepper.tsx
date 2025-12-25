import React, { useMemo, useCallback } from 'react';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import ProgressCircle from './ProgressCircle';
import { MobileStepperProps } from '@/modules/auth/types/sign-up/sign-up';
import Logo from '@/components/logo/Logo';

const MobileStepper: React.FC<MobileStepperProps> = React.memo(
  ({ steps, currentStep = 0, backgroundColor = 'bg-muted', showLogo = true }) => {
    const t = useCustomTranslation();

    const stepperCalculations = useMemo(() => {
      const totalSteps = steps.length;
      const currentStepNumber = currentStep + 1;
      const currentStepInfo = steps[currentStep];
      const isSignupComplete =
        currentStep === steps.length - 1 && steps[steps.length - 1]?.label === 'Payment';
      const isOnboardingComplete =
        currentStep === steps.length - 1 && steps[steps.length - 1]?.label === 'Done';

      return {
        totalSteps,
        currentStepNumber,
        currentStepInfo,
        isSignupComplete: isSignupComplete || isOnboardingComplete,
      };
    }, [steps, currentStep]);

    const { totalSteps, currentStepNumber, currentStepInfo, isSignupComplete } =
      stepperCalculations;

    const renderLogo = useCallback(() => {
      if (!showLogo) return null;
      return <Logo isOpen={true} className="flex mb-8" />;
    }, [showLogo]);

    const renderStepInfo = useCallback(
      () => (
        <div>
          <h2 className="font-semibold text-foreground">{t(currentStepInfo?.label)}</h2>
          <p className="text-muted-foreground">{t(currentStepInfo?.description)}</p>
        </div>
      ),
      [currentStepInfo, t]
    );

    return (
      <div className={`flex flex-col ${backgroundColor} p-6`}>
        {renderLogo()}
        <div className="flex items-center gap-4">
          <ProgressCircle
            currentStep={currentStepNumber}
            totalSteps={totalSteps}
            isSignupComplete={isSignupComplete}
          />
          {renderStepInfo()}
        </div>
      </div>
    );
  }
);

MobileStepper.displayName = 'MobileStepper';

export default MobileStepper;
