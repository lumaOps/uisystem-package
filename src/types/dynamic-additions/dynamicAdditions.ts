import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { SelectOption } from '../common/select/selectCustom';

export enum DYNAMIC_ADDITIONS_TYPE {
  DEFAULT = 'DEFAULT',
  ISOLATE = 'ISOLATE',
}

export interface ColumnConfig {
  title?: string;
  dataIndex?: string;
  key?: string;
  className?: string;
  width?: string;
  colSpan?: number;
}

export interface FieldConfig {
  id: string;
  componentType?: 'input' | 'select' | 'phone';
  name: string;
  optionName?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  defaultValue?: string;
  filterUsedOptions?: boolean;
  colSpan?: number;
  required?: true;
}

export interface FooterConfig {
  id?: string;
  label?: string;
  className?: string;
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  action?: string;
  icon?: React.ReactNode;
}

export interface RowData {
  [key: string]: string;
}

export interface FormIntegration<TFormValues extends FieldValues = FieldValues> {
  form?: UseFormReturn<TFormValues>;
  fieldName?: string;
  useFormValidation?: boolean;
}

export interface DynamicAdditionsProps<TFormValues extends FieldValues = FieldValues> {
  errors?: FieldErrors<FieldValues>;
  tableClassName?: string;
  tableHeaderClassName?: string;
  tableBodyClassName?: string;
  tableFooterClassName?: string;
  dynamicAddtionType?: DYNAMIC_ADDITIONS_TYPE;
  tableColumns?: ColumnConfig[];
  tableFields?: FieldConfig[];
  tableFooter?: FooterConfig[];
  initialRows?: RowData[];
  maxRows?: number;
  minRows?: number;
  enableValidation?: boolean;
  onRowAdd?: (newRow: RowData, rowIndex: number) => void;
  onRowChange?: (rowIndex: number, fieldId: string, value: string, allRows: RowData[]) => void;
  onRowDelete?: (rowIndex: number, deletedRow: RowData, remainingRows: RowData[]) => void;
  onDataChange?: (data: RowData[]) => void;
  formIntegration?: FormIntegration<TFormValues>;
  initialOptions?: Record<string, SelectOption[]>;
  rowClassName?: string;
}
