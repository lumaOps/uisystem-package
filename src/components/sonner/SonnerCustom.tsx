'use client';

import { toast } from 'sonner';
import { CustomButton } from '../button/CustomButton';

export function SonnerCustom() {
  return (
    <div>
      <CustomButton
        variant="outline"
        className="m-5"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            position: 'top-right',
            action: {
              label: 'Try again',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast top right
      </CustomButton>
      <CustomButton
        variant="outline"
        className="m-5"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            position: 'bottom-right',
            action: {
              label: 'Try again',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </CustomButton>
    </div>
  );
}
