import { inventoryAddEditService } from '@/modules/inventory/services/add-edit/inventoryAddEdit';
import { ApiResponseError, ApiResponseSuccess } from '@/types/api-services/api';
import { $getRoot, $getSelection, LexicalEditor } from 'lexical';
import { $createParagraphNode } from 'lexical';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type InsertAiTextParams = {
  aiText?: string;

  transmission?: string;
  editorName?: string;
  formZodObject?: UseFormReturn<FieldValues>;
};

export async function insertAiText(params: InsertAiTextParams, activeEditor?: LexicalEditor) {
  if (!activeEditor || typeof activeEditor.dispatchCommand !== 'function') {
    console.error('Invalid LexicalEditor passed to insertAiText');
    return;
  }
  const missingFields: string[] = [];
  const model = params?.formZodObject?.getValues('model');
  const make = params?.formZodObject?.getValues('make');
  const year = params?.formZodObject?.getValues('year');
  const transmission = params?.formZodObject?.getValues('transmission');

  if (!make) missingFields.push('Make');
  if (!model) missingFields.push('Model');
  if (!year) missingFields.push('Year');
  if (!transmission) missingFields.push('Transmission');
  const fieldName = params.editorName || 'description';

  if (missingFields.length > 0) {
    const formattedFields = missingFields.join(', ');
    const errorMessage = `The following attributes are required: ${formattedFields}`;
    params.formZodObject?.setError(fieldName, {
      type: 'manual',
      message: errorMessage,
    });

    return;
  }
  const response: ApiResponseSuccess<{ description: string }> | ApiResponseError =
    await inventoryAddEditService.getInventoryDescriptionAi(make, model, year, transmission);

  let description = '';
  if ('data' in response && response.data?.description) {
    description = response.data.description;
  } else {
    console.warn('AI description not found or API error:', response);
  }

  const rootElement = activeEditor.getRootElement();
  if (rootElement) {
    rootElement.focus();
  }

  activeEditor.update(() => {
    params.formZodObject?.clearErrors(fieldName);
    const root = $getRoot();
    root.clear();
    root.append($createParagraphNode());
    const selection = $getSelection();
    if (selection) {
      selection.insertText(description);
    }
  });
}
