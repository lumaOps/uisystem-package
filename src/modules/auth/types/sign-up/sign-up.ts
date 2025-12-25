// Type definitions for sign-up module
export interface MobileStepperProps {
  steps: Array<{ label: string; description?: string }>;
  currentStep: number;
  className?: string;
  backgroundColor?: string;
  showLogo?: boolean;
}

