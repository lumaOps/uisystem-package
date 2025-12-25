import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { CustomButtonProps } from '@/components/button/CustomButton';
import { SelectOption } from '@/types/common/select/selectCustom';
import { DateAvailability, TimeSlot } from '../common/date-time-picker/dateTimePicker';
import { MultipleSelectsData, SelectConfig } from '../common/multiple-select/multipleSelect';
import {
  ColumnConfig,
  DYNAMIC_ADDITIONS_TYPE,
  FieldConfig,
  FooterConfig,
  FormIntegration,
  RowData,
} from '../dynamic-additions/dynamicAdditions';

export type componentDisplayType = {
  label?: string;
  value?: string;
  className?: string;
  id?: string;
  description?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  name: string;
  optionName?: string;
  tooltipContent?: string;
  startIcon?: string;
  endIcon?: React.ReactNode;
  inputClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
  fields?: string[];
  mode?: 'range' | 'single' | 'multiple';
  as?: 'input' | 'button';
  maxWidth?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
  component?: string;
  numInputs?: number;
  options?: SelectOption[];
  control?: unknown;
  errors?: FieldErrors<FieldValues>;
  componentType?: string;
  validations?: {
    type: string;
    controls: ControlType[];
  };
  acceptFiles?: { [key: string]: string[] } | undefined;
  multipleFile?: boolean;
  maxFiles?: number;
  minFiles?: number;
  maxFileSize?: number;
  minFileSize?: number;
  multipleSelectsData?: MultipleSelectsData;
  multipleSelectsConfig?: SelectConfig[];
  orientation?: 'horizontal' | 'vertical';
  showpasswordcriteria?: boolean;
  maxLength?: number;
  actions?: (CustomButtonProps & {
    call?: string;
  })[];
  change_mode?: changeModeEnum.onBlur | changeModeEnum.onChange;
  dynamicAddtionType?: DYNAMIC_ADDITIONS_TYPE;
  tableColumns?: ColumnConfig[];
  tableFields?: FieldConfig[];
  tableFooter?: FooterConfig[];
  minRows?: number;
  maxRows?: number;
  initialRows?: RowData[];
  initialOptions?: Record<string, SelectOption[]>;
  formIntegration?: FormIntegration;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  availabilityData?: DateAvailability[];
  placeholder?: string;
  disabled?: boolean;
  selectedDate?: string | Date;
  selectedTimeSlot?: TimeSlot;
  inside?: boolean;
  icon: string;
};

export enum changeModeEnum {
  onChange = 'onChange',
  onBlur = 'onBlur',
}
// --- Enum for your component keys --- //
export enum COMPONENTS_DYNAMIC_FORM {
  CHECKBOX = 'Checkbox',
  HEADING_1 = 'Heading 1',
  HEADING_2 = 'Heading 2',
  HEADING_3 = 'Heading 3',
  PARAGRAPH = 'Paragraph',
  INPUT = 'Input',
  SELECT = 'Select',
  INPUT_OTP = 'Input OTP',
  SEPARATOR = 'Separator',
  BUTTON = 'Button',
  UPLOAD = 'Upload',
  UPLOAD_PDF = 'Upload PDF',
  TEXTAREA = 'Textarea',
  DATE_PICKER = 'Date Picker',
  TIME_PICKER = 'Time Picker',
  TOGGLE = 'Toggle',
  RADIO_GROUP = 'Radio Group',
  INPUT_PHONE_NUMBER = 'Input Phone Number',
  COMBOBOX = 'Combobox',
  MULTIPLE_SELECTS = 'Multiple selects',
  EDITOR = 'Editor',
  INPUT_SELECT = 'Input select',
  SWITCH = 'Switch',
  COMPLEX_ADD = 'Complex add',
  DATE_TIME_PICKER = 'Date Time Picker',
  TAGS = 'Tags',
  COLOR_INPUT = 'Color Input',
  INPUT_CREDIT_CARD = 'Input Credit Card',
  ALERT = 'Alert',
}

export type ControlType = {
  minLength?: number;
  maxLength?: number;
  length?: number;
  email?: boolean;
  url?: boolean;
  uuid?: boolean;
  cuid?: boolean;
  pattern?: string;
  startsWith?: string;
  endsWith?: string;
  datetime?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
  nonNegative?: boolean;
  negative?: boolean;
  multipleOf?: number;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  field?: string;
  name?: string;
  type?: string;
  message: string; // Required because every control has a message
};

// Define the type for the controls array
export type Controls = ControlType[];

export type FormsReaderPropsType = {
  file?: string;
  getZodSchema: (data: z.ZodObject<z.ZodRawShape>) => void;
  getNamesInform?: (names: string[]) => void;
  zodObject?: UseFormReturn<FieldValues>;
  initialData?: Record<string, unknown>;
  formsReady?: boolean;
};
