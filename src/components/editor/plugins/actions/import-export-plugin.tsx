'use client';

import { exportFile, importFile } from '@lexical/file';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import { CustomButton } from '@/components/button/CustomButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/tooltip';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

export function ImportExportPlugin() {
  const t = useCustomTranslation();
  const [editor] = useLexicalComposerContext();
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <CustomButton
            variant={'ghost'}
            onClick={() => importFile(editor)}
            title="Import"
            aria-label="Import editor state from JSON"
            size={'sm'}
            className="p-2"
          >
            <UploadIcon className="size-4" />
          </CustomButton>
        </TooltipTrigger>
        <TooltipContent>{t('Import Content')}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <CustomButton
            variant={'ghost'}
            onClick={() =>
              exportFile(editor, {
                fileName: `Playground ${new Date().toISOString()}`,
                source: 'Playground',
              })
            }
            title="Export"
            aria-label="Export editor state to JSON"
            size={'sm'}
            className="p-2"
          >
            <DownloadIcon className="size-4" />
          </CustomButton>
        </TooltipTrigger>
        <TooltipContent>{t('Export Content')}</TooltipContent>
      </Tooltip>
    </>
  );
}
