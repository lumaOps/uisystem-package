'use client';

import { CustomAlertDialog } from '@/components/alert-dialog/AlertDialogCustom';

const AlertdialogWrapper = () => {
  const handleAction = () => {
    console.log('Click Alert');
  };
  return (
    <div className="p-10">
      <CustomAlertDialog
        triggerText="Open Dialog"
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        cancelText="Cancel"
        actionText="Continue"
        onAction={handleAction}
      />
    </div>
  );
};

export default AlertdialogWrapper;
