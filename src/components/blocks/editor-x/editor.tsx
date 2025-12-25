'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';

import { FloatingLinkContext } from '@/components/editor/context/floating-link-context';
import { SharedAutocompleteContext } from '@/components/editor/context/shared-autocomplete-context';
import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/tooltip/tooltip';

import { nodes } from './nodes';
import { Plugins } from './plugins';
import { CustomButtonProps } from '@/components/button/CustomButton';

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  classNameContent,
  children,
  readOnly = false,
  maxLength = 500,
  actions,
  actionsParams,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  classNameContent?: string;
  children?: React.ReactNode;
  readOnly?: boolean;
  maxLength?: number;
  actions?: (CustomButtonProps & {
    call?: string;
  })[];
  actionsParams?: Record<string, unknown>;
}) {
  return (
    <div className="rounded-lg border bg-background shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
          editable: !readOnly,
        }}
      >
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <Plugins
                classNameContent={classNameContent}
                maxLength={maxLength}
                actions={actions}
                actionsParams={actionsParams}
              />

              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={editorState => {
                  onChange?.(editorState);
                  onSerializedChange?.(editorState.toJSON());
                }}
              />
              {children}
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
