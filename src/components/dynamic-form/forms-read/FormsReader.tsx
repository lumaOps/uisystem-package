'use client';

import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { DateAvailability } from '@/components/date-time-picker/DateTimePicker';
import { dropzoneFileType } from '@/components/dropzone/dropzone';
import { FormSkeleton } from '@/components/skeleton/FormSkeleton';
import { useDynamicFormsQuery } from '@/hooks/queries/dynamic-forms/useDynamicFormsQuery';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { MultipleSelectsData } from '@/types/common/multiple-select/multipleSelect';
import { SelectOption } from '@/types/common/select/selectCustom';
import {
  COMPONENTS_DYNAMIC_FORM,
  componentDisplayType,
  FormsReaderPropsType,
} from '@/types/dynamic-form/dynamicForm';
import { getComponent } from '../options/ComponentReturn';
import { buildZodSchemaFromJson } from '../schema/DynamicZodSchema';

function FormsReader({
  file = '',
  getZodSchema,
  zodObject,
  initialData,
  formsReady,
  getNamesInform,
}: FormsReaderPropsType) {
  const [formData, setFormData] = useState<componentDisplayType[]>([]);
  const selectKeyList: string[] = [
    COMPONENTS_DYNAMIC_FORM.SELECT,
    COMPONENTS_DYNAMIC_FORM.MULTIPLE_SELECTS,
    COMPONENTS_DYNAMIC_FORM.INPUT_SELECT,
    COMPONENTS_DYNAMIC_FORM.TAGS,
    COMPONENTS_DYNAMIC_FORM.COMBOBOX,
  ];
  const t = useCustomTranslation();
  const { data, isLoading, error } = useDynamicFormsQuery(file, t.locale);

  // State to hold collected names
  // useEffect that processes data and sends schema to parent in one step
  useEffect(() => {
    if (data) {
      // Validate API response format
      if (!data) {
        console.error('Invalid data format: Expected non-empty array.');
        setFormData([]);
        return;
      }

      // Extract form configuration from API response
      const response = data as {
        id: string;
        path: string;
        schema: {
          name: string;
          description: string;
          elements: (componentDisplayType | componentDisplayType[])[];
          metadata: Record<string, unknown>;
        };
      };

      // Update form data state
      setFormData(response?.schema?.elements as componentDisplayType[]);

      // Generate schema and send to parent immediately
      const schema = buildZodSchemaFromJson(response?.schema?.elements as componentDisplayType[]);
      getZodSchema(schema);

      // Collect all names after formData is processed
      const names: string[] = [];
      const elements = (response?.schema?.elements as componentDisplayType[]) || [];

      const extractNamesFromItem = (item: componentDisplayType) => {
        if (
          item.component === COMPONENTS_DYNAMIC_FORM.MULTIPLE_SELECTS &&
          Array.isArray(item.multipleSelectsConfig)
        ) {
          item.multipleSelectsConfig.forEach(config => {
            if (config.name) names.push(config.name);
          });
        } else if (Array.isArray(item.fields) && item.fields.length > 0) {
          item.fields.forEach(fieldName => names.push(fieldName));
        } else if (item.name) {
          names.push(item.name);
        }
      };

      elements.forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(subItem => extractNamesFromItem(subItem));
        } else {
          extractNamesFromItem(item);
        }
      });

      // Call the parent callback with the collected names
      if (getNamesInform) {
        // Check if the prop was provided
        getNamesInform(names);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Determine loading state
  const shouldShowLoader = formsReady !== undefined ? !formsReady : isLoading;

  // Show loading skeleton while data is being processed
  if (shouldShowLoader) {
    return (
      <div className="flex justify-center">
        <FormSkeleton />
      </div>
    );
  }

  // Show error message if API call fails
  if (error) {
    return <div className="text-destructive">{t('Error loading form data.')}</div>;
  }

  // Render form components based on configuration
  const renderFormFields = () => (
    <div className="flex flex-col w-full gap-2">
      {formData.length > 0 ? (
        formData.map((item: componentDisplayType, index) => {
          if (Array.isArray(item)) {
            // Render multiple components in horizontal layout
            return (
              <div key={index} className="flex flex-wrap gap-4 m-1">
                {item.map((subItem, subIndex) => {
                  const isComplexLayoutComponent = [
                    COMPONENTS_DYNAMIC_FORM.MULTIPLE_SELECTS,
                  ].includes(subItem.component || '');
                  return (
                    <div
                      key={subIndex}
                      className={isComplexLayoutComponent ? 'w-full lg:flex-1 md:flex-1' : 'flex-1'}
                    >
                      {getComponent({
                        ...subItem,
                        formZodObject: zodObject,
                        initialData:
                          selectKeyList.includes(subItem.component) &&
                          Array.isArray(initialData?.[subItem.optionName || subItem.name])
                            ? (initialData[subItem.optionName || subItem.name] as SelectOption[])
                            : (subItem.component === COMPONENTS_DYNAMIC_FORM.UPLOAD ||
                                  subItem.component === COMPONENTS_DYNAMIC_FORM.UPLOAD_PDF) &&
                                Array.isArray(initialData?.[subItem.optionName || subItem.name])
                              ? (initialData[
                                  subItem.optionName || subItem.name
                                ] as dropzoneFileType[])
                              : subItem.component === COMPONENTS_DYNAMIC_FORM.MULTIPLE_SELECTS
                                ? (initialData?.[
                                    subItem.optionName || subItem.name
                                  ] as MultipleSelectsData)
                                : subItem.component === COMPONENTS_DYNAMIC_FORM.INPUT_SELECT
                                  ? (initialData?.[
                                      (subItem.fields?.[1] as string | undefined) ?? ''
                                    ] as MultipleSelectsData)
                                  : subItem.component === COMPONENTS_DYNAMIC_FORM.DATE_TIME_PICKER
                                    ? ((initialData?.[
                                        subItem.optionName || subItem.name
                                      ] as DateAvailability) ?? undefined)
                                    : subItem.component === COMPONENTS_DYNAMIC_FORM.COMPLEX_ADD
                                      ? initialData
                                      : subItem.component === COMPONENTS_DYNAMIC_FORM.COMBOBOX
                                        ? (initialData as unknown as SelectOption)
                                        : undefined,
                      })}
                    </div>
                  );
                })}
              </div>
            );
          } else {
            // Render single component in vertical layout
            return (
              <div key={index} className="m-1">
                {getComponent({
                  ...item,
                  formZodObject: zodObject ?? ({} as UseFormReturn<FieldValues>),
                  initialData:
                    selectKeyList.includes(item.component || '') &&
                    Array.isArray(initialData?.[item.optionName || item.name])
                      ? (initialData[item.optionName || item.name] as SelectOption[])
                      : item.component === COMPONENTS_DYNAMIC_FORM.UPLOAD &&
                          Array.isArray(initialData?.[item.optionName || item.name])
                        ? (initialData[item.optionName || item.name] as dropzoneFileType[])
                        : item.component === COMPONENTS_DYNAMIC_FORM.INPUT_SELECT
                          ? (initialData?.[
                              (item.fields?.[1] as string | undefined) ?? ''
                            ] as MultipleSelectsData)
                          : [],
                })}
              </div>
            );
          }
        })
      ) : (
        // Show loading spinner while form data is being processed
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );

  return <>{renderFormFields()}</>;
}

export default FormsReader;
