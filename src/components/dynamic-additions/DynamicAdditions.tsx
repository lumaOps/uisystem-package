'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '../table/table';
import { cn } from '@/utils/utils';
import { CustomButton } from '../button/CustomButton';
import { SelectCustom } from '../select/SelectCustom';
import { Trash2 } from 'lucide-react';
import { InputPhoneNumber } from '../input/InputPhoneNumber';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { InputCustom } from '../input/InputCustom';
import { FieldPath, FieldValues } from 'react-hook-form';
import {
  DYNAMIC_ADDITIONS_TYPE,
  DynamicAdditionsProps,
  FieldConfig,
  RowData,
} from '@/types/dynamic-additions/dynamicAdditions';
import { getValidItems } from '@/utils/helpers/helperFunctions';
import { SelectOption } from '@/types/common/select/selectCustom';

function DynamicAdditions<TFormValues extends FieldValues = FieldValues>({
  tableClassName = 'w-full',
  tableHeaderClassName = 'w-full',
  tableBodyClassName = 'w-full',
  rowClassName = '',
  tableFooterClassName,
  dynamicAddtionType = DYNAMIC_ADDITIONS_TYPE.DEFAULT,
  tableColumns,
  tableFields,
  tableFooter,
  initialRows,
  maxRows,
  minRows = 1,
  enableValidation = false,
  onRowAdd,
  onRowChange,
  onRowDelete,
  onDataChange,
  formIntegration,
  initialOptions,
  errors,
}: DynamicAdditionsProps<TFormValues>) {
  const t = useCustomTranslation();
  const form = formIntegration?.form;
  const fieldName = formIntegration?.fieldName;

  const watchedFieldData =
    form && fieldName ? form.watch(fieldName as FieldPath<TFormValues>) : undefined;

  const columnsConfig = useMemo(() => tableColumns || [], [tableColumns]);
  const fieldsConfig = useMemo(() => tableFields || [], [tableFields]);
  const footerConfig = useMemo(() => tableFooter || [], [tableFooter]);

  // Calculate total columns for proper colSpan
  const calculateTotalColumns = useCallback(() => {
    if (dynamicAddtionType === DYNAMIC_ADDITIONS_TYPE.DEFAULT) {
      // Sum up all colSpan values from columns config, plus 1 for actions column
      const headerColSpan = getValidItems(columnsConfig)?.reduce((total, column) => {
        return total + (column.colSpan || 1);
      }, 0);
      return headerColSpan + 1; // +1 for actions column
    } else {
      // For ISOLATE dynamicAddtionType, sum up colSpan from fields config
      return getValidItems(fieldsConfig)?.reduce((total, field) => {
        return total + (field.colSpan || 1);
      }, 0);
    }
  }, [columnsConfig, fieldsConfig, dynamicAddtionType]);

  const createEmptyRow = useCallback((): RowData => {
    return getValidItems(fieldsConfig)?.reduce((acc, field) => {
      acc[field?.name || ''] = field.defaultValue || '';
      return acc;
    }, {} as RowData);
  }, [fieldsConfig]);

  const [localRows, setLocalRows] = useState<RowData[]>(() => {
    if (form && fieldName && watchedFieldData) {
      return Array.isArray(watchedFieldData) ? watchedFieldData : [];
    }
    if (initialRows && initialRows.length > 0) {
      return initialRows;
    }
    return Array.from({ length: Math.max(minRows, 1) }, () => createEmptyRow());
  });

  const rows = form && fieldName && watchedFieldData ? watchedFieldData : localRows;

  useEffect(() => {
    if (form && fieldName && !watchedFieldData) {
      form.setValue(
        fieldName as FieldPath<TFormValues>,
        localRows as FieldPath<TFormValues> extends string
          ? TFormValues[FieldPath<TFormValues>]
          : never
      );
    }
  }, [localRows, form, fieldName, watchedFieldData]);

  useEffect(() => {
    if (rows.length > 0) {
      onDataChange?.(rows);
    }
  }, [rows, onDataChange]);

  // Function to get filtered options for select fields
  const getFilteredOptions = useCallback(
    (field: FieldConfig, currentRowIndex: number) => {
      const originalOptions =
        typeof initialOptions === 'string'
          ? JSON.parse(initialOptions)?.[field.optionName || field.name] || []
          : (initialOptions as Record<string, SelectOption[]>)?.[field.optionName || field.name] ||
            [];
      // If filterUsedOptions is not enabled for this field, return original options
      if (!field.filterUsedOptions) {
        return originalOptions;
      }

      // Get all selected values from other rows for this field
      const usedValues = rows
        .map((row, index) => {
          // Exclude current row to allow changing selection
          if (index === currentRowIndex) return null;
          return row[field.name || ''];
        })
        .filter(value => value !== null && value !== '' && value !== undefined);

      // Filter out used options
      return originalOptions.filter((option: SelectOption) => {
        // Assuming options have a 'value' property
        const optionValue = typeof option === 'object' && option !== null ? option.value : option;
        return !usedValues.includes(String(optionValue));
      });
    },
    [initialOptions, rows]
  );

  const handleFieldChange = useCallback(
    (rowIndex: number, fieldId: string, value: string) => {
      const updateRows = (prevRows: RowData[]) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [fieldId]: value,
        };
        onRowChange?.(rowIndex, fieldId, value, updatedRows);
        return updatedRows;
      };

      if (form && fieldName) {
        const currentData = form.getValues(fieldName as FieldPath<TFormValues>) || [];
        const updatedRows = updateRows(Array.isArray(currentData) ? currentData : []);
        form.setValue(
          fieldName as FieldPath<TFormValues>,
          updatedRows as FieldPath<TFormValues> extends string
            ? TFormValues[FieldPath<TFormValues>]
            : never,
          {
            shouldValidate: true,
          }
        );
      } else {
        setLocalRows(updateRows);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [enableValidation, onRowChange, form, fieldName]
  );

  const handleAddRow = useCallback(
    () => {
      if (maxRows && rows.length >= maxRows) {
        return;
      }

      const newRow = createEmptyRow();
      const newRowIndex = rows.length;

      const updateRows = (prevRows: RowData[]) => {
        const updatedRows = [...prevRows, newRow];
        onRowAdd?.(newRow, newRowIndex);
        return updatedRows;
      };

      if (form && fieldName) {
        const currentData = form.getValues(fieldName as FieldPath<TFormValues>) || [];
        const updatedRows = updateRows(Array.isArray(currentData) ? currentData : []);
        form.setValue(
          fieldName as FieldPath<TFormValues>,
          updatedRows as FieldPath<TFormValues> extends string
            ? TFormValues[FieldPath<TFormValues>]
            : never,
          {
            shouldValidate: false,
          }
        );
      } else {
        setLocalRows(updateRows);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [rows.length, maxRows, createEmptyRow, onRowAdd, enableValidation, form, fieldName]
  );

  const handleDeleteRow = useCallback(
    (rowIndex: number) => {
      if (rows.length <= minRows) {
        return;
      }

      const updateRows = (prevRows: RowData[]) => {
        const deletedRow = prevRows[rowIndex];
        const updatedRows = prevRows.filter((_, index) => index !== rowIndex);
        onRowDelete?.(rowIndex, deletedRow, updatedRows);
        return updatedRows;
      };

      if (form && fieldName) {
        const currentData = form.getValues(fieldName as FieldPath<TFormValues>) || [];
        const updatedRows = updateRows(Array.isArray(currentData) ? currentData : []);
        form.setValue(
          fieldName as FieldPath<TFormValues>,
          updatedRows as FieldPath<TFormValues> extends string
            ? TFormValues[FieldPath<TFormValues>]
            : never,
          {
            shouldValidate: true,
          }
        );
      } else {
        setLocalRows(updateRows);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [rows.length, minRows, onRowDelete, form, fieldName]
  );

  const handleFooterButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, action?: string, customHandler?: () => void) => {
      event.preventDefault();
      event.stopPropagation();

      if (customHandler) {
        customHandler();
        return;
      }

      switch (action) {
        case 'add':
          handleAddRow();
          break;
        default:
          break;
      }
    },
    [handleAddRow]
  );
  function getDeepValue<T extends object>(obj: T | undefined, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc === undefined || acc === null) return undefined;

      // Support array syntax like phones[0].number
      const arrayMatch = key.match(/(.*?)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        if (typeof acc === 'object' && acc !== null && arrayKey in acc) {
          const arrayValue = (acc as Record<string, unknown>)[arrayKey];
          return Array.isArray(arrayValue) ? arrayValue[Number(index)] : undefined;
        }
        return undefined;
      }

      // Regular object property
      return typeof acc === 'object' && acc !== null
        ? (acc as Record<string, unknown>)[key]
        : undefined;
    }, obj);
  }

  const renderFieldComponent = useCallback(
    (field: FieldConfig, rowIndex: number, value: string) => {
      // Build the full path to the error
      // Example: company_information.phones[0].number
      const fieldPath = `${fieldName}.${rowIndex}.${field.name}`;

      // Use lodash.get (or a utility function) to safely access deeply nested properties
      const fieldError = getDeepValue(errors, fieldPath);

      const errorMessage =
        typeof fieldError === 'object' && fieldError !== null && 'message' in fieldError
          ? ((fieldError as { message?: string }).message ?? '')
          : '';

      const commonProps = {
        id: `${field.name}_${rowIndex}`,
        className: cn(field.className),
        value: value,
        onChange: (newValue: string) => handleFieldChange(rowIndex, field?.name || '', newValue),
        errorMessage: errorMessage,
      };

      const isIsolatedynamicAddtionType = dynamicAddtionType === DYNAMIC_ADDITIONS_TYPE.ISOLATE;
      const placeholder = field.placeholder;

      const renderInput = () => {
        switch (field.componentType) {
          case 'input':
            return (
              <InputCustom
                {...commonProps}
                type={field.type || 'text'}
                placeholder={placeholder}
                label={isIsolatedynamicAddtionType ? field.label : ''}
                onChange={event =>
                  handleFieldChange(rowIndex, field?.name || '', event.target.value)
                }
              />
            );
          case 'phone':
            return (
              <InputPhoneNumber
                {...commonProps}
                type={field.type || 'tel'}
                placeholder={placeholder}
                {...(isIsolatedynamicAddtionType ? { label: field.label } : {})}
              />
            );
          case 'select':
            // Get filtered options based on field configuration
            const availableOptions = getFilteredOptions(field, rowIndex);

            return (
              <SelectCustom
                {...commonProps}
                className={cn('w-full', field.className)}
                options={availableOptions}
                placeholder={placeholder || t('Select an option') || 'Select an option'}
                value={value}
                onValueChange={newValue => handleFieldChange(rowIndex, field?.name || '', newValue)}
                {...(isIsolatedynamicAddtionType ? { label: field.label } : {})}
              />
            );
          default:
            return null;
        }
      };

      return <div className="space-y-1">{renderInput()}</div>;
    },
    [handleFieldChange, dynamicAddtionType, t, getFilteredOptions, errors, fieldName]
  );
  const isAddDisabled = maxRows ? rows.length >= maxRows : false;
  const isDeleteDisabled = rows.length <= minRows;

  return (
    <div className="space-y-4">
      <Table className={cn('border-none', tableClassName)}>
        {dynamicAddtionType === DYNAMIC_ADDITIONS_TYPE.DEFAULT && (
          <TableHeader className={cn('border-none bg-transparent', tableHeaderClassName)}>
            <TableRow className="border-none bg-transparent">
              {getValidItems(columnsConfig)?.map(column => (
                <TableCell
                  key={column.key}
                  className={cn('font-medium p-0', column.className)}
                  style={column.width ? { width: column.width } : undefined}
                  colSpan={column.colSpan ?? 1}
                >
                  {t(column.title || '')}
                </TableCell>
              ))}
              <TableCell className="w-12" aria-label="Actions" />
            </TableRow>
          </TableHeader>
        )}

        <TableBody className={cn('border-none', tableBodyClassName)}>
          {rows.map((row, rowIndex) => {
            // Group fields by rows based on colSpan
            const fieldRows: FieldConfig[][] = [];
            let currentRow: FieldConfig[] = [];
            let currentRowSpan = 0;
            const totalColumns =
              getValidItems(columnsConfig)?.reduce((total, column) => {
                return total + (column.colSpan || 1);
              }, 0) || 0;
            getValidItems(fieldsConfig)?.forEach(field => {
              const fieldColSpan = field.colSpan ?? 1;

              if (currentRowSpan + fieldColSpan > totalColumns) {
                // Start new row
                if (currentRow.length > 0) {
                  fieldRows.push(currentRow);
                }
                currentRow = [field];
                currentRowSpan = fieldColSpan;
              } else {
                currentRow.push(field);
                currentRowSpan += fieldColSpan;
              }
            });

            if (currentRow.length > 0) {
              fieldRows.push(currentRow);
            }
            return (
              <TableRow
                key={`row_${rowIndex}`}
                className="border-none relative hover:bg-transparent"
              >
                <TableCell colSpan={calculateTotalColumns()} className="p-0 pt-2 pb-2">
                  <div className={cn(' overflow-hidden border-none', rowClassName)}>
                    {fieldRows.map((fieldRow, subRowIndex) => (
                      <div key={subRowIndex} className={cn('flex w-full flex-wrap')}>
                        {fieldRow.map(field => (
                          <div key={field.name} className={cn(' flex-1 p-1')}>
                            {renderFieldComponent(field, rowIndex, row[field.name] || '')}
                          </div>
                        ))}
                        {/* Delete button inside wrapper */}
                        {subRowIndex === 0 && (
                          <div className="absolute right-3 top-1">
                            <CustomButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRow(rowIndex)}
                              className="text-destructive hover:text-destructive/80 p-2"
                              disabled={isDeleteDisabled}
                              type="button"
                            >
                              {dynamicAddtionType === DYNAMIC_ADDITIONS_TYPE.ISOLATE ? (
                                t('Remove')
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </CustomButton>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className={cn('border-none bg-transparent', tableFooterClassName)}>
          <TableRow className="border-none hover:bg-transparent">
            <TableCell
              colSpan={calculateTotalColumns()}
              className="border-none flex gap-2 items-center"
            >
              {getValidItems(footerConfig)?.map(footerItem => (
                <CustomButton
                  key={footerItem.id}
                  variant={footerItem.variant}
                  className={cn(
                    'flex items-center gap-2',
                    footerItem.className,
                    footerItem.action === 'add' && isAddDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={event => handleFooterButtonClick(event, footerItem.action)}
                  disabled={footerItem.action === 'add' && isAddDisabled}
                  aria-label={footerItem.label}
                  icon={footerItem.icon}
                  type="button"
                >
                  {footerItem.label}
                </CustomButton>
              ))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default DynamicAdditions;
