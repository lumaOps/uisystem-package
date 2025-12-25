import { CheckboxCustom } from '@/components/checkbox/CheckboxCustom';
import { InputCustom } from '@/components/input/InputCustom';
import { OtpInput } from '@/components/otp-input/OtpInput';
import { Separator } from '@/components/separator/separator';
import { SelectCustom } from '@/components/select/SelectCustom';
import { cn } from '@/utils/utils';
import { CustomButton } from '@/components/button/CustomButton';
import EditorXCustom from '@/components/editor/EditorXCustom';
import { Controller, FieldError, FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import {
  changeModeEnum,
  componentDisplayType,
  COMPONENTS_DYNAMIC_FORM,
} from '@/types/dynamic-form/dynamicForm';
import { SelectOption } from '@/types/common/select/selectCustom';
import DropzoneCustom from '@/components/dropzone/DropzoneCustom';
import { FormField } from '@/components/form/form';
import { InputPhoneNumber } from '@/components/input/InputPhoneNumber';
import { ComboboxCustom } from '@/components/combobox/ComboboxCustom';
import { InputSelectCustom } from '@/components/input/InputSelectCustom';
import { MultipleSelectCustom } from '@/components/multiple-select/MultipleSelectCustom';
import { useRef } from 'react';
import { MultipleSelectsData } from '@/types/common/multiple-select/multipleSelect';
import { TextareaCustom } from '@/components/textarea/TextareaCustom';
import { DatePickerCustom } from '@/components/date-picker/DatePickerCustom';
import { SwitchCustom } from '@/components/switch/SwitchCustom';
import { RadioGroupCustom } from '@/components/radio-group/RadioGroupCustom';
import DropzonePdf from '@/components/dropzone/DropzonePdf';
import DynamicIconLucide from '@/components/dynamic-icon-lucide/DynamicIconLucide';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip/tooltip';
import { HelpCircle } from 'lucide-react';
import DynamicAdditions from '@/components/dynamic-additions/DynamicAdditions';
import { DateTimePicker } from '@/components/date-time-picker';
import { DateAvailability } from '@/components/date-time-picker/DateTimePicker';
import { Tags } from '@/components/tags/Tags';
import ColorInput from '@/components/color-input/ColorInput';
import { InputCreditCard } from '@/components/input/InputCreditCard';
import { AlertCustom } from '@/components/alert/AlertCustom';

// Cache for generated IDs to avoid regeneration
const idCache = new Map<string, string>();

// Utility function to generate stable IDs
const generateStableId = (id?: string, name?: string): string => {
  if (id) return id;

  const cacheKey = name || 'unknown';
  if (idCache.has(cacheKey)) {
    return idCache.get(cacheKey)!;
  }

  const newId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 9);

  idCache.set(cacheKey, newId);
  return newId;
};

// Utility function to filter attributes
const getFilteredAttributes = (attributes: Record<string, unknown>, excludeKeys: string[]) => {
  return Object.fromEntries(
    Object.entries(attributes).filter(([key]) => !excludeKeys.includes(key))
  );
};

export function getComponent(
  props: componentDisplayType & { formZodObject: UseFormReturn<FieldValues> } & {} & {
    initialData?: unknown;
  }
) {
  const { component, formZodObject, initialData, fields, ...attributes } = props;

  // Early return for invalid formZodObject
  if (!formZodObject) {
    console.error('formZodObject is undefined. Ensure it is passed correctly.');
    return <></>;
  }

  // Calculate error message directly (no hooks needed)

  // Helper function to get nested error messages

  function getNestedError<TFieldValues extends FieldValues>(
    errors: FieldErrors<TFieldValues>,
    fieldPath: string
  ): FieldError | undefined {
    const keys = fieldPath.split('.');
    let current: unknown = errors;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    if (
      current &&
      typeof current === 'object' &&
      'message' in current &&
      typeof (current as FieldError).message === 'string'
    ) {
      return current as FieldError;
    }

    return undefined;
  }

  // For a field named "vehicule.make":
  const fieldError = getNestedError(formZodObject.formState.errors, attributes.name);
  let errorMessage = null;
  if (component === COMPONENTS_DYNAMIC_FORM.INPUT_SELECT) {
    // Check both input and select field errors
    const inputError = getNestedError(formZodObject.formState.errors, fields?.[0] || '');
    const selectError = getNestedError(formZodObject.formState.errors, fields?.[1] || '');
    errorMessage = inputError?.message || selectError?.message;
  } else {
    errorMessage = fieldError?.message;
  }

  // const errorMessage = fieldError?.message as string | undefined;

  // Generate stable component ID
  const componentID = generateStableId(attributes.id, attributes.name);

  // Pre-calculate filtered attributes for reuse
  const filteredAttributes = getFilteredAttributes(attributes, ['componentType']);
  const filteredAttributesForPhone = getFilteredAttributes(attributes, [
    'componentType',
    'maxWidth',
  ]);
  const filteredAttributesForButton = getFilteredAttributes(attributes, [
    'containerClassName',
    'componentType',
  ]);

  // Pre-calculate options and data
  const componentOptions = attributes?.options || (initialData as SelectOption[]) || [];
  const uploadSrc = (initialData as (string | File)[]) || [];
  const multipleSelectsData =
    attributes?.multipleSelectsData || (initialData as MultipleSelectsData) || [];
  const DatePickerAvailibiltyData = (initialData as DateAvailability[]) || [];

  switch (component) {
    case COMPONENTS_DYNAMIC_FORM.CHECKBOX:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <div>
              <CheckboxCustom
                {...field}
                {...attributes}
                value={field.value ?? ''}
                id={componentID}
                checked={field.value}
                onCheckedChange={e => {
                  field.onChange(e);
                }}
                errorMessage={errorMessage}
              />
            </div>
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.HEADING_1:
      return (
        <h1
          id={componentID}
          {...attributes}
          className={cn('flex flex-wrap gap-3', attributes.className)}
        >
          {attributes.startIcon && (
            <DynamicIconLucide
              iconName={attributes.startIcon as string}
              className={attributes.startIconClassName}
            />
          )}
          {attributes.label || 'Title 1'}
          {attributes.tooltipContent && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{attributes.tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h1>
      );

    case COMPONENTS_DYNAMIC_FORM.ALERT:
      return (
        <AlertCustom
          title={attributes.label || 'Card Title'}
          icon={attributes.startIcon}
          containerClassName="flex items-center gap-9"
          titleClassName="ml-3 text-sm"
        />
      );
    case COMPONENTS_DYNAMIC_FORM.HEADING_2:
      return (
        <h2
          id={componentID}
          {...attributes}
          className={cn('flex flex-wrap gap-3', attributes.className)}
        >
          {attributes.startIcon && (
            <DynamicIconLucide
              iconName={attributes.startIcon as string}
              className={attributes.startIconClassName}
            />
          )}
          {attributes.label || 'Title 2'}
          {attributes.tooltipContent && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{attributes.tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h2>
      );

    case COMPONENTS_DYNAMIC_FORM.HEADING_3:
      return (
        <h3
          id={componentID}
          {...attributes}
          className={cn('flex flex-wrap gap-3', attributes.className)}
        >
          {attributes.startIcon && (
            <DynamicIconLucide
              iconName={attributes.startIcon as string}
              className={attributes.startIconClassName}
            />
          )}
          {attributes.label || 'Title 3'}
          {attributes.tooltipContent && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{attributes.tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
      );

    case COMPONENTS_DYNAMIC_FORM.PARAGRAPH:
      return (
        <p
          id={componentID}
          {...attributes}
          className={cn('leading-7 [&:not(:first-child)]:mt-6', attributes.className)}
        >
          {attributes.startIcon && (
            <DynamicIconLucide
              iconName={attributes.startIcon as string}
              className={attributes.startIconClassName}
            />
          )}
          {attributes.label || 'Paragraph'}
          {attributes.tooltipContent && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{attributes.tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </p>
      );

    case COMPONENTS_DYNAMIC_FORM.INPUT:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <InputCustom
              {...field}
              value={field.value ?? ''}
              type={attributes.componentType || 'text'}
              className={attributes.containerClassName}
              id={componentID}
              {...filteredAttributes}
              errorMessage={errorMessage}
              onChange={e => {
                if (attributes.componentType === 'number') {
                  field.onChange(Number(e.target.value));
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.INPUT_CREDIT_CARD:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <InputCreditCard
              {...field}
              value={field.value ?? ''}
              id={componentID}
              {...filteredAttributes}
              errorMessage={errorMessage}
              onChange={(val: string) => {
                field.onChange(val);
              }}
            />
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.MULTIPLE_SELECTS:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <div>
            <MultipleSelectCustom
              configs={attributes.multipleSelectsConfig || []}
              data={multipleSelectsData}
              setValue={formZodObject.setValue}
              getValues={formZodObject.getValues}
              watch={formZodObject.watch}
              control={formZodObject.control}
              errors={formZodObject.formState.errors}
            />
          </div>
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.TEXTAREA:
      return (
        <div className="w-full">
          <Controller
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => (
              <TextareaCustom
                id={componentID}
                {...filteredAttributes}
                {...field}
                value={field.value ?? ''}
                errorMessage={errorMessage}
                onChange={e => {
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.DATE_TIME_PICKER:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <DateTimePicker
              id={attributes.id || generateStableId(undefined, attributes.name)}
              label={attributes.label}
              className={attributes.className}
              containerClassName={attributes.containerClassName}
              availabilityData={DatePickerAvailibiltyData || []}
              selectedDate={field.value?.date}
              selectedTimeSlot={field.value?.timeSlot}
              placeholder={attributes.placeholder}
              disabled={attributes.disabled}
              onDateTimeSelect={field.onChange}
              errorMessage={errorMessage}
            />
          )}
        />
      );
    case COMPONENTS_DYNAMIC_FORM.DATE_PICKER:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => {
            const mode = attributes.mode || 'single';

            const handleSelect = (selected: unknown) => {
              if (mode === 'single' && selected instanceof Date) {
                field.onChange(selected);
              } else if (mode === 'multiple' && Array.isArray(selected)) {
                field.onChange(selected);
              } else if (
                mode === 'range' &&
                selected &&
                typeof selected === 'object' &&
                'from' in selected &&
                'to' in selected
              ) {
                field.onChange(selected);
              }
            };

            return (
              <div className={cn(attributes?.containerClassName)}>
                <DatePickerCustom
                  mode={mode}
                  selected={
                    mode === 'single'
                      ? field.value instanceof Date
                        ? field.value
                        : typeof field.value === 'string' || typeof field.value === 'number'
                          ? new Date(field.value)
                          : undefined
                      : field.value
                  }
                  onSelect={handleSelect}
                  description={attributes.description}
                  label={attributes.label}
                  labelClassName={attributes.labelClassName}
                  tooltipContent={attributes.tooltipContent}
                  id={attributes.id}
                  {...attributes} // pass any extra custom props safely
                />
              </div>
            );
          }}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.INPUT_SELECT:
      return (
        <InputSelectCustom
          nameInput={fields?.[0] || ''}
          nameSelect={fields?.[1] || ''}
          options={componentOptions}
          inputType={attributes.componentType || 'text'}
          id={componentID}
          {...filteredAttributes}
          formData={formZodObject}
          errorMessage={errorMessage}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.SELECT:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <SelectCustom
              id={componentID}
              {...attributes}
              value={field.value != null ? String(field.value) : ''}
              onValueChange={field.onChange}
              options={componentOptions}
              errorMessage={errorMessage}
              className={attributes.containerClassName}
              triggerClassName={attributes.containerClassName}
            />
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.INPUT_OTP:
      return (
        <FormField
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <OtpInput
              {...field}
              id={componentID}
              label={attributes.label || 'Verification Code'}
              description={attributes.description || 'Enter the 6-digit code sent to your device.'}
              numInputs={attributes.numInputs || 6}
              errorMessage={errorMessage}
              {...attributes}
              onChange={e => {
                field.onChange(e);
              }}
              value={field.value ?? ''}
            />
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.COMBOBOX:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <div>
              <ComboboxCustom
                {...attributes}
                options={componentOptions}
                errorMessage={errorMessage}
                onChange={(value: SelectOption) => {
                  field.onChange(value.value);
                }}
                type={attributes.componentType}
                value={field.value ?? ''}
              />
            </div>
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.SEPARATOR:
      return (
        <Separator orientation="horizontal" className={cn('w-[100%]', attributes.className)} />
      );

    case COMPONENTS_DYNAMIC_FORM.BUTTON:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <CustomButton id={componentID} {...filteredAttributesForButton}>
            {attributes.label}
          </CustomButton>
        </div>
      );

    case COMPONENTS_DYNAMIC_FORM.UPLOAD:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => (
              <DropzoneCustom
                maxFiles={attributes.maxFiles}
                multiple={attributes.multipleFile}
                maxSize={attributes.maxFileSize}
                minSize={attributes.minFileSize}
                accept={attributes.acceptFiles}
                {...attributes}
                formZodObject={formZodObject}
                name={attributes.name}
                src={uploadSrc}
                className="w-full border-dashed border border-gray-300 rounded-lg p-4"
                onChange={field.onChange}
              />
            )}
          />
        </div>
      );

    case COMPONENTS_DYNAMIC_FORM.INPUT_PHONE_NUMBER:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <InputPhoneNumber
              {...field}
              value={field.value ?? ''}
              id={componentID}
              {...filteredAttributesForPhone}
              errorMessage={errorMessage}
            />
          )}
        />
      );

    case COMPONENTS_DYNAMIC_FORM.EDITOR:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => {
              const lastHtmlRef = useRef<string>(field.value);

              return (
                <EditorXCustom
                  classNameContent={attributes.className}
                  defaultValue={field.value}
                  onChangeEditor={(html: string) => {
                    lastHtmlRef.current = html;
                    if (attributes.change_mode === changeModeEnum.onChange) {
                      field.onChange(lastHtmlRef.current);
                    }
                  }}
                  actionsParams={{
                    formZodObject: formZodObject,
                    editorName: attributes.name || '',
                  }}
                  onBlur={() => {
                    if (attributes.change_mode !== changeModeEnum.onChange)
                      field.onChange(lastHtmlRef.current);
                  }}
                  errorMessage={errorMessage}
                  {...attributes}
                />
              );
            }}
          />
        </div>
      );

    case COMPONENTS_DYNAMIC_FORM.SWITCH:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => {
              return (
                <SwitchCustom
                  id={componentID}
                  className={attributes.className}
                  defaultValue={field.value}
                  onCheckedChange={e => {
                    field.onChange(e);
                  }}
                  {...attributes}
                  errorMessage={errorMessage}
                />
              );
            }}
          />
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.RADIO_GROUP:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => {
              return (
                <RadioGroupCustom
                  data={componentOptions}
                  id={componentID}
                  itemClassName={attributes.className}
                  value={field.value}
                  onValueChange={e => {
                    field.onChange(e);
                  }}
                  {...attributes}
                  errorMessage={errorMessage}
                />
              );
            }}
          />
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.UPLOAD_PDF:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => (
              <DropzonePdf
                maxFiles={attributes.maxFiles}
                maxSize={attributes.maxFileSize}
                minSize={attributes.minFileSize}
                {...attributes}
                formZodObject={formZodObject}
                name={attributes.name}
                src={field.value || []}
                className="w-full border-dashed border border-gray-300 rounded-lg p-4"
                onChange={field.onChange}
              />
            )}
          />
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.COMPLEX_ADD:
      return (
        <div className={cn(attributes?.containerClassName)}>
          <FormField
            control={formZodObject.control}
            name={attributes.name || ''}
            render={({ field }) => (
              <DynamicAdditions
                {...attributes}
                rowClassName={attributes?.className || ''}
                onDataChange={field.onChange}
                initialRows={field.value}
                formIntegration={{
                  form: formZodObject,
                  fieldName: attributes.name,
                }}
                errors={formZodObject.formState.errors}
                initialOptions={
                  (attributes.initialOptions as Record<string, SelectOption[]>) ||
                  (initialData as Record<string, SelectOption[]>)
                }
              />
            )}
          />
        </div>
      );
    case COMPONENTS_DYNAMIC_FORM.TAGS:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <Tags
              id={componentID}
              value={field.value || []}
              onValueChange={field.onChange}
              options={componentOptions}
              placeholder={attributes.placeholder}
              inside={attributes.inside}
              className={attributes.className}
              errorMessage={errorMessage}
            />
          )}
        />
      );
    case COMPONENTS_DYNAMIC_FORM.COLOR_INPUT:
      return (
        <Controller
          control={formZodObject.control}
          name={attributes.name || ''}
          render={({ field }) => (
            <div>
              <ColorInput
                id={componentID}
                label={attributes.label || ''}
                color={field.value || ''}
                placeholder={attributes.placeholder || 'Select a color'}
                onColorChange={field.onChange}
              />
              {errorMessage && (
                <p
                  id={`${componentID}-error`}
                  className="flex items-center gap-1 text-xs font-medium text-destructive mt-1"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        />
      );
    default:
      return <></>;
  }
}
