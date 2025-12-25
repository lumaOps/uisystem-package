'use client';

import { useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { CustomButton } from '@/components/button/CustomButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/tooltip';

export function EditModeTogglePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CustomButton
          variant={'ghost'}
          onClick={() => {
            editor.setEditable(!editor.isEditable());
            setIsEditable(editor.isEditable());
          }}
          title="Read-Only Mode"
          aria-label={`${!isEditable ? 'Unlock' : 'Lock'} read-only mode`}
          size={'sm'}
          className="p-2"
        >
          {isEditable ? <LockIcon className="size-4" /> : <UnlockIcon className="size-4" />}
        </CustomButton>
      </TooltipTrigger>
      <TooltipContent>{isEditable ? 'View Only Mode' : 'Edit Mode'}</TooltipContent>
    </Tooltip>
  );
}
