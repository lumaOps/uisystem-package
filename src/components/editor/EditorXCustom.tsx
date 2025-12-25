'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { SerializedEditorState } from 'lexical';
import { Editor } from '@/components/blocks/editor-x/editor';
import { HTMLExportPlugin } from '@/components/blocks/editor-x/HTMLExportPlugin';
import { HTMLImportPlugin } from '@/components/blocks/editor-x/HTMLImportPlugin';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { CustomButtonProps } from '../button/CustomButton';

const fallbackSerializedState: SerializedEditorState = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

type EditorXCustomProps = {
  classNameContent?: string;
  onChangeEditor?: (html: string) => void;
  onBlur?: () => void;
  defaultValue?: string;
  label?: string;
  id?: string;
  labelClassName?: string;
  tooltipContent?: string;
  readOnly?: boolean;
  errorMessage?: string;
  maxLength?: number;
  actions?: (CustomButtonProps & {
    call?: string;
  })[];
  actionsParams?: Record<string, unknown>;
};

const EditorXCustom = ({
  classNameContent,
  onChangeEditor,
  onBlur,
  defaultValue,
  label,
  id,
  labelClassName,
  tooltipContent,
  readOnly = false,
  errorMessage,
  maxLength = 500,
  actions,
  actionsParams,
}: EditorXCustomProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEditorChange = useCallback(
    (html: string) => {
      onChangeEditor?.(html);
    },
    [onChangeEditor]
  );

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  // Empty callback for onSerializedChange prop
  const handleSerializedChange = useCallback(() => {}, []);

  // Use fallback state only when no defaultValue is provided
  const editorState = useMemo(() => {
    return defaultValue ? undefined : fallbackSerializedState;
  }, [defaultValue]);

  // Memoize label to avoid re-creation on every render
  const labelComponent = useMemo(() => {
    if (!label) return null;
    return (
      <Label
        htmlFor={id}
        className={cn('text-sm font-medium', labelClassName)}
        tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
        showTooltip={!!tooltipContent}
      >
        {label}
      </Label>
    );
  }, [id, label, labelClassName, tooltipContent]);

  // Only render HTMLImportPlugin when defaultValue exists
  const htmlImportPlugin = useMemo(() => {
    if (!defaultValue) return null;
    // If the defaultValue is plain text (not HTML), wrap it in a paragraph
    const htmlContent = defaultValue.trim().startsWith('<')
      ? defaultValue
      : `<p>${defaultValue}</p>`;
    return <HTMLImportPlugin html={htmlContent} />;
  }, [defaultValue]);

  if (!isMounted) return null;

  return (
    <div className={cn('space-y-1')}>
      {labelComponent}

      <div
        onBlur={handleBlur}
        className={cn(
          'rounded-md',
          readOnly && 'cursor-not-allowed opacity-60',
          errorMessage &&
            'border-destructive border-1 focus-within:border-destructive focus-within:ring-destructive'
        )}
      >
        <Editor
          editorSerializedState={editorState}
          onSerializedChange={handleSerializedChange}
          classNameContent={cn(classNameContent)}
          readOnly={readOnly}
          maxLength={maxLength}
          actionsParams={actionsParams}
          actions={actions}
        >
          {htmlImportPlugin}
          <HTMLExportPlugin onChange={handleEditorChange} />
        </Editor>
      </div>
      {errorMessage && (
        <p className={cn('text-sm text-destructive mt-1')} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default EditorXCustom;
