// Type definitions for website module
export interface HorizontalStepperProps {
  steps: Array<{ label: string; description?: string }>;
  currentStep: number;
  className?: string;
}

