'use client';
import { CustomToast } from '@/components/toast/ToastCustom';
import { CustomButton } from '@/components/button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

export default function ToastWrapper() {
  const t = useCustomTranslation();

  const handleAction = () => {
    console.log('handle action');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex gap-4">
        <CustomButton
          onClick={() =>
            CustomToast({
              title: 'Success',
              description: 'Everything went smoothly',
              duration: 5000,
            })
          }
        >
          {t('Show Success Toast')}
        </CustomButton>

        <CustomButton
          variant="destructive"
          onClick={() =>
            CustomToast({
              title: 'Error!',
              description: 'Something went wrong',
              variant: 'destructive',
              withAction: true,
              actionText: 'Try again',
              onActionClick: () => handleAction,
              position: 'middle',
            })
          }
        >
          {t('Show Error Toast')}
        </CustomButton>
      </div>
    </div>
  );
}
