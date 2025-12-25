'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useCallback, useRef } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';

export function HTMLExportPlugin({ onChange }: { onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleUpdate = useCallback(() => {
    editor.getEditorState().read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      onChangeRef.current?.(html);
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      handleUpdate();
    });
  }, [editor, handleUpdate]);

  return null;
}
