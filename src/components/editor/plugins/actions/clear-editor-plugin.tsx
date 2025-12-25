'use client';

import { Trash2Icon } from 'lucide-react';
import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog/Dialog';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { CustomButton } from '@/components/button/CustomButton';

export function ClearEditorActionPlugin() {
  const t = useCustomTranslation();
  const [editor] = useLexicalComposerContext();

  return (
    <Dialog>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <CustomButton size={'sm'} variant={'ghost'} className="p-2">
              <Trash2Icon className="h-4 w-4" />
            </CustomButton>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('Clear Editor')}</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Clear Editor')}</DialogTitle>
          <DialogDescription>{t('Are you sure you want to clear the editor?')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <CustomButton variant="outline">{t('Cancel')}</CustomButton>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              variant="destructive"
              onClick={() => {
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
              }}
            >
              {t('Clear')}
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
