import { VariantProps } from 'class-variance-authority';
import { customButtonVariants } from '@/components/button/CustomButton';
import React from 'react';

/**
 * CustomButtonVariantsType - The variant properties from the CustomButton component
 */
export type CustomButtonVariantsType = VariantProps<typeof customButtonVariants>;

/**
 * CustomButtonVariant - The available visual variants for buttons
 */
export type CustomButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

/**
 * CustomButtonSize - The available size variations for buttons
 */
export type CustomButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * CustomButtonType - The base props type for custom buttons, including all HTML button attributes
 */
export interface CustomButtonType
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CustomButtonVariantsType {
  /**
   * Determines if the component should be rendered as its children
   */
  asChild?: boolean;

  /**
   * Icon element to display on the left side of the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon element to display on the right side of the button text
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether icons should be displayed
   */
  withIcon?: boolean;

  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;

  /**
   * Whether the button should take up the full width of its container
   */
  fullWidth?: boolean;
}

/**
 * ButtonActionType - Type for button click handlers with optional parameters
 */
export type ButtonActionType = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
