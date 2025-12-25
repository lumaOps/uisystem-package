'use client';

import * as React from 'react';
import { useCallback, useMemo } from 'react';

import { cn } from '@/utils/utils';
import { CustomButton } from '@/components/button/CustomButton';
import { CustomSheetProps } from '@/types/common/sheet/sheetCustom';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import CopyCustom from '../copy/CopyCustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

const SheetHeaderSection: React.FC<{
  title?: string;
  description?: string;
  titleClassName: string;
  descriptionClassName: string;
  showButton: boolean;
  actionButton?: () => void;
  buttonVariant: CustomSheetProps['buttonVariant'];
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onCopyDescription: () => void;
  showCopyButton: boolean;
  headerContent?: React.ReactNode;
  t: (key: string) => string;
}> = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  showButton,
  actionButton,
  buttonVariant,
  buttonText,
  buttonIcon,
  onCopyDescription,
  showCopyButton,
  headerContent,
  t,
}) => (
  <SheetHeader className="">
    <div className="flex items-center justify-between pt-4">
      <div className="">
        {headerContent ? (
          headerContent
        ) : (
          <>
            <div className="flex flex-col">
              {title && (
                <SheetTitle
                  className={cn('text-lg font-semibold flex items-start', titleClassName)}
                >
                  {t(title)}
                </SheetTitle>
              )}
              {description && (
                <div className="flex items-center gap-2">
                  <SheetDescription
                    className={cn('text-sm text-muted-foreground', descriptionClassName)}
                  >
                    {t(description)}
                  </SheetDescription>
                  {showCopyButton && onCopyDescription && <CopyCustom onCopy={onCopyDescription} />}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showButton && (
        <div className="flex justify-end sm:justify-start items-center">
          <CustomButton
            variant={buttonVariant}
            onClick={actionButton}
            className="h-8 sm:p-5 gap-2 text-foreground text-sm font-medium"
          >
            {buttonIcon}
            <span>{t(buttonText)}</span>
          </CustomButton>
        </div>
      )}
    </div>
  </SheetHeader>
);

// footer component - Updated with new functionality
const SheetFooterSection: React.FC<{
  footerClassName: string;
  onSave?: () => void;
  onClose?: () => void;
  onSecondaryAction?: () => void; // Nouvelle prop pour action secondaire
  saveButtonText?: string;
  closeButtonText?: string;
  secondaryButtonText?: string; // Nouveau texte pour le bouton secondaire
  isSaveLoading?: boolean;
  saveButtonDisabled?: boolean;
  isSaveDisabled?: boolean;
  shouldCloseOnSecondaryAction?: boolean; // Contrôle si l'action secondaire ferme le sheet
  t: (key: string) => string;
}> = ({
  footerClassName,
  onSave,
  onClose,
  onSecondaryAction,
  saveButtonText,
  closeButtonText,
  secondaryButtonText,
  isSaveLoading,
  saveButtonDisabled,
  isSaveDisabled,
  shouldCloseOnSecondaryAction = true, // Par défaut, ferme le sheet
  t,
}) => (
  <SheetFooter className={cn('flex-shrink-0 pt-4 border-t', footerClassName)}>
    <div className="flex items-center justify-end w-full gap-3">
      {/* Bouton secondaire (Back, Cancel, etc.) */}
      {(onClose || onSecondaryAction) && (
        <>
          {shouldCloseOnSecondaryAction ? (
            <SheetClose asChild>
              <CustomButton variant="outline" onClick={onSecondaryAction || onClose}>
                {t(secondaryButtonText || closeButtonText || 'Cancel')}
              </CustomButton>
            </SheetClose>
          ) : (
            <CustomButton variant="outline" onClick={onSecondaryAction || onClose}>
              {t(secondaryButtonText || closeButtonText || 'Back')}
            </CustomButton>
          )}
        </>
      )}

      {/* Bouton de sauvegarde */}
      {onSave && (
        <CustomButton
          onClick={onSave}
          isLoading={isSaveLoading}
          disabled={saveButtonDisabled || isSaveDisabled || isSaveLoading}
        >
          {t(saveButtonText || 'Save')}
        </CustomButton>
      )}
    </div>
  </SheetFooter>
);

export const CustomSheet: React.FC<CustomSheetProps> = ({
  triggerText,
  triggerContent,
  title,
  description,
  content,
  footer = false,
  ContentClassName = '',
  ButtonClassName,
  titleClassName = '',
  descriptionClassName = '',
  footerClassName = '',
  ButtonTriggerVariant = 'outline',
  onSave,
  onClose,
  closeButtonText,
  saveButtonText,
  saveButtonDisabled,
  isSaveLoading,
  isSaveDisabled,
  showButton = false,
  buttonText = 'Action',
  buttonIcon,
  buttonVariant = 'outline',
  actionButton,
  open,
  onOpenChange,
  showCopyButton = true,
  headerContent,
  // Nouvelles props pour le footer
  onSecondaryAction,
  secondaryButtonText,
  shouldCloseOnSecondaryAction = true,
}) => {
  const t = useCustomTranslation();

  // Memoize copy function to prevent unnecessary re-renders
  const handleCopyDescription = useCallback(() => {
    if (!description) return;
    navigator.clipboard.writeText(description);
  }, [description]);

  // Memoize computed CSS classes
  const contentClasses = useMemo(
    () => cn('w-full flex flex-col', ContentClassName),
    [ContentClassName]
  );

  // Memoize trigger button to prevent recreation
  const triggerButton = useMemo(() => {
    // Si triggerText est un composant React, l'utiliser directement
    if (React.isValidElement(triggerText)) {
      return triggerText;
    }
    // Sinon, créer un CustomButton avec le texte
    return (
      <CustomButton variant={ButtonTriggerVariant} className={ButtonClassName}>
        {triggerText}
      </CustomButton>
    );
  }, [triggerText, ButtonClassName, ButtonTriggerVariant]);

  // Memoize header props to prevent unnecessary re-renders of header component
  const headerProps = useMemo(
    () => ({
      title,
      description,
      titleClassName,
      descriptionClassName,
      showButton,
      actionButton,
      buttonVariant,
      buttonText,
      buttonIcon,
      onCopyDescription: handleCopyDescription,
      showCopyButton,
      headerContent,
      t,
    }),
    [
      title,
      description,
      titleClassName,
      descriptionClassName,
      showButton,
      actionButton,
      buttonVariant,
      buttonText,
      buttonIcon,
      handleCopyDescription,
      showCopyButton,
      headerContent,
      t,
    ]
  );

  // Memoize footer props - Updated with new props
  const footerProps = useMemo(
    () => ({
      footerClassName,
      onSave,
      onClose,
      onSecondaryAction, // Nouvelle prop
      closeButtonText,
      saveButtonText,
      secondaryButtonText, // Nouvelle prop
      saveButtonDisabled,
      isSaveLoading,
      isSaveDisabled,
      shouldCloseOnSecondaryAction, // Nouvelle prop
      t,
    }),
    [
      footerClassName,
      onSave,
      onClose,
      onSecondaryAction, // Ajouter aux dépendances
      closeButtonText,
      saveButtonText,
      secondaryButtonText, // Ajouter aux dépendances
      saveButtonDisabled,
      isSaveLoading,
      isSaveDisabled,
      shouldCloseOnSecondaryAction, // Ajouter aux dépendances
      t,
    ]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {triggerText ? (
        <SheetTrigger className="focus:outline-none focus:ring-0" asChild>
          {triggerButton}
        </SheetTrigger>
      ) : (
        triggerContent && (
          <SheetTrigger className="focus:outline-none focus:ring-0" asChild>
            {triggerContent}
          </SheetTrigger>
        )
      )}
      <SheetContent className={contentClasses}>
        <SheetHeaderSection {...headerProps} />

        {/* Content container with proper overflow handling */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-1 -mx-1 pb-4">{content}</div>
        </div>

        {footer && <SheetFooterSection {...footerProps} />}
      </SheetContent>
    </Sheet>
  );
};
