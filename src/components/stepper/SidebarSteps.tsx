import React, { useMemo, useCallback } from 'react';
import { Check, LifeBuoy } from 'lucide-react';
import { CustomButton } from '@/components/button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { SidebarStepsProps } from '@/modules/auth/types/sign-up/sign-up';
import { Separator } from '@/components/separator/separator';
import Logo from '@/components/logo/Logo';

const SidebarSteps: React.FC<SidebarStepsProps> = ({ steps, currentStep = 0, onContactClick }) => {
  const t = useCustomTranslation();

  // Memoize step status calculations
  const getStepStatus = useCallback(
    (idx: number) => {
      const step = steps[idx];
      const isCurrentStepComplete =
        idx === currentStep && (step?.label === 'Payment' || step?.label === 'Done');

      return {
        isCompleted: idx < currentStep || isCurrentStepComplete,
        isCurrent: idx === currentStep,
        isUpcoming: idx > currentStep,
      };
    },
    [currentStep, steps]
  );

  // Memoize the step circle class names
  const getStepCircleClassName = useCallback((status: ReturnType<typeof getStepStatus>) => {
    const baseClasses =
      'flex items-center justify-center w-12 h-12 rounded-full text-base font-semibold transition-all';
    if (status.isCompleted) return `${baseClasses} bg-chart-6 text-base-white`;
    if (status.isCurrent)
      return `${baseClasses} bg-background border-2 border-primary text-primary`;
    return `${baseClasses} bg-background border-2 border-border text-foreground`;
  }, []);

  // Memoize the steps list
  const renderedSteps = useMemo(() => {
    return steps.map((step, idx) => {
      const status = getStepStatus(idx);
      const circleClassName = getStepCircleClassName(status);

      return (
        <li key={step.label} className="flex items-start gap-4 relative min-h-[72px]">
          {/* Step circle */}
          <div className="relative flex flex-col items-center my-0.5 gap-1">
            <span className={circleClassName}>
              {status.isCompleted ? <Check className="w-7 h-7" /> : idx + 1}
            </span>
            {/* Vertical line below the circle, except for the last step */}
            {idx < steps.length - 1 && <Separator orientation="vertical" className="h-9" />}
          </div>
          {/* Step text */}
          <div className="pt-2">
            <div className="font-semibold text-foreground">{t(step.label)}</div>
            <div className="text-sm text-muted-foreground">{t(step.description)}</div>
          </div>
        </li>
      );
    });
  }, [steps, getStepStatus, getStepCircleClassName, t]);

  // Memoize the contact section
  const contactSection = useMemo(
    () => (
      <div className="text-xs mt-10">
        <LifeBuoy className="w-6 h-6 mb-3 text-muted-foreground" />
        <div className="mb-2 text-sm text-foreground font-bold">{t('Need help?')}</div>
        <div className="mb-2 text-muted-foreground">{t('Contact our support team.')}</div>
        <CustomButton
          variant="outline"
          size="sm"
          onClick={onContactClick}
          className="text-muted-foreground"
        >
          {t('Click Here to Contact Us')}
        </CustomButton>
      </div>
    ),
    [onContactClick, t]
  );

  return (
    <aside className="w-75 bg-muted border-r px-6 py-8 flex flex-col justify-between min-h-screen">
      <div className="relative">
        {/* Logo at the top */}
        <Logo isOpen={true} className="flex mb-8" />
        <ol className="relative z-10">{renderedSteps}</ol>
      </div>
      {contactSection}
    </aside>
  );
};

export default React.memo(SidebarSteps);
