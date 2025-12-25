'use client';

import { useCallback, useState } from 'react';

import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { $getSelection, $isRangeSelection, BaseSelection } from 'lexical';
import { Minus, Plus } from 'lucide-react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { useUpdateToolbarHandler } from '@/components/editor/editor-hooks/use-update-toolbar';
import { CustomButton } from '@/components/button/CustomButton';
import { InputCustom } from '@/components/input/InputCustom';

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const style = 'font-size';
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        'font-size',
        `${DEFAULT_FONT_SIZE}px`
      );
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });
      setFontSize(size);
    },
    [activeEditor, style]
  );

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <CustomButton
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateFontSize(fontSize - 1)}
          disabled={fontSize <= MIN_FONT_SIZE}
        >
          <Minus className="size-3" />
        </CustomButton>
        <InputCustom
          id="font-size-toolbar-input-id"
          value={fontSize}
          onChange={e => updateFontSize(parseInt(e.target.value) || DEFAULT_FONT_SIZE)}
          containerClassName="h-8 w-12 px-2 py-0"
          inputClassName="text-center text-sm h-full py-0"
          className="!space-y-0"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
        />
        <CustomButton
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateFontSize(fontSize + 1)}
          disabled={fontSize >= MAX_FONT_SIZE}
        >
          <Plus className="size-3" />
        </CustomButton>
      </div>
    </div>
  );
}
