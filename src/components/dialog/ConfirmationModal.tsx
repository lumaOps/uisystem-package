'use client';

import React from 'react';
import { DialogCustom } from '@/components/dialog/DialogCustom';
import { CustomButton } from '@/components/button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { AlertTriangle, Info, HelpCircle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { ConfirmationModalProps } from '@/types/common/dialog/confirmationModal';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
  onConfirm,
  onCancel,
  variant = 'default',
  confirmText,
  cancelText,
  isLoading = false,
  className,
  preventClose = false,
  showIcon = true,
  classNameContent,
}) => {
  const t = useCustomTranslation();

  // Get variant-specific styling and content
  const getVariantConfig = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <Trash2 className="h-5 w-5 text-destructive" />,
          confirmButtonVariant: 'destructive' as const,
          defaultConfirmText: t('Delete'),
          iconBgColor: 'bg-destructive/10',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-chart-4" />,
          confirmButtonVariant: 'default' as const,
          defaultConfirmText: t('Continue'),
          iconBgColor: 'bg-chart-4/10',
        };
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-primary" />,
          confirmButtonVariant: 'default' as const,
          defaultConfirmText: t('Confirm'),
          iconBgColor: 'bg-primary/10',
        };
      default:
        return {
          icon: <HelpCircle className="h-5 w-5 text-muted-foreground" />,
          confirmButtonVariant: 'default' as const,
          defaultConfirmText: t('Confirm'),
          iconBgColor: 'bg-muted/50',
        };
    }
  };

  const variantConfig = getVariantConfig();
  const finalConfirmText = confirmText || variantConfig.defaultConfirmText;
  const finalCancelText = cancelText || t('Cancel');

  const handleConfirm = async () => {
    if (isLoading) return;
    await onConfirm();
  };

  const handleCancel = () => {
    if (isLoading) return;
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };
  return (
    <DialogCustom
      open={open}
      onOpenChange={preventClose || isLoading ? undefined : onOpenChange}
      header={title}
      headerPosition="start"
      headerClassName="mb-4"
      className={cn('max-w-md', className)}
      preventClose={preventClose || isLoading}
    >
      <div className="space-y-6">
        {/* Icon and Content */}
        <div className={cn('flex gap-4 items-start', classNameContent)}>
          {showIcon && (
            <div className={cn('flex-shrink-0 rounded-full p-2', variantConfig.iconBgColor)}>
              {variantConfig.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {children && <div className="text-sm text-muted-foreground">{children}</div>}
          </div>
        </div>
        {/* Footer with buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <CustomButton variant="outline" onClick={handleCancel} disabled={isLoading}>
            {finalCancelText}
          </CustomButton>
          <CustomButton
            variant={variantConfig.confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? t('Loading...') : finalConfirmText}
          </CustomButton>
        </div>
      </div>
    </DialogCustom>
  );
};

export default ConfirmationModal;
