'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useRef } from 'react';
import { FOCUS_COMMAND, BLUR_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';

type HTMLImportPluginProps = {
  html?: string;
};

export function HTMLImportPlugin({ html }: HTMLImportPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastProcessedHtml = useRef<string | undefined>('');
  const isFocused = useRef(false);
  const ignoreNextUpdate = useRef(false);

  useEffect(() => {
    const removeFocusListener = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        isFocused.current = true;
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const removeBlurListener = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        isFocused.current = false;
        ignoreNextUpdate.current = true;
        setTimeout(() => {
          ignoreNextUpdate.current = false;
        }, 50);
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeFocusListener();
      removeBlurListener();
    };
  }, [editor]);

  useEffect(() => {
    if (!html || html === lastProcessedHtml.current) return;

    const replaceContentIfUnfocused = () => {
      if (isFocused.current || ignoreNextUpdate.current) {
        lastProcessedHtml.current = html;

        return;
      }

      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();

        root.clear();
        root.append(...nodes);
        lastProcessedHtml.current = html;
      });
    };

    replaceContentIfUnfocused();
  }, [editor, html]);

  return null;
}
