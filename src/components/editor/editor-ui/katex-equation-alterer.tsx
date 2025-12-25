import * as React from 'react';
import { useCallback, useState, JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ErrorBoundary } from 'react-error-boundary';
import KatexRenderer from '@/components/editor/editor-ui/katex-renderer';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { CheckboxCustom } from '@/components/checkbox/CheckboxCustom';
import { InputCustom } from '@/components/input/InputCustom';
import { TextareaCustom } from '@/components/textarea/TextareaCustom';
import { Label } from '@/components/label/Label';
import { CustomButton } from '@/components/button/CustomButton';

type Props = {
  initialEquation?: string;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = '',
}: Props): JSX.Element {
  const t = useCustomTranslation();
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);

  const onClick = useCallback(() => {
    onConfirm(equation, inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  return (
    <>
      <div className="flex items-center space-x-2">
        <CheckboxCustom
          label={t('Inline')}
          id="inline-toggle"
          checked={inline}
          onCheckedChange={onCheckboxChange}
        />
      </div>

      <div className="space-y-2">
        {inline ? (
          <InputCustom
            id="equation-input"
            label={t('Equation')}
            onChange={event => setEquation(event.target.value)}
            value={equation}
            placeholder="Enter inline equation..."
          />
        ) : (
          <TextareaCustom
            id="equation-input"
            onChange={event => setEquation(event.target.value)}
            label={t('Equation')}
            value={equation}
            placeholder="Enter block equation..."
            className="min-h-[100px]"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('Visualization')}</Label>
        <div className="rounded-md border bg-muted p-4">
          <ErrorBoundary onError={e => editor._onError(e)} fallback={null}>
            <KatexRenderer equation={equation} inline={false} onDoubleClick={() => null} />
          </ErrorBoundary>
        </div>
      </div>

      <div className="flex justify-end">
        <CustomButton onClick={onClick}>{t('Confirm')}</CustomButton>
      </div>
    </>
  );
}
