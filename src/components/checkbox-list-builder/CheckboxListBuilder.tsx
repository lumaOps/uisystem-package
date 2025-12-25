import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { CheckboxCustom } from '../checkbox/CheckboxCustom';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { SquarePen, Trash2, Check, X } from 'lucide-react';
import { ComboboxCustom } from '../combobox/ComboboxCustom';
import { SelectOption } from '@/types/common/select/selectCustom';
import { Label } from '../label/Label';
import { InputCustom } from '../input/InputCustom';
import { CheckboxListBuilderProps, EquipmentOption } from '@/modules/inventory/types/inventory';

function CheckboxListBuilder({
  placeholder = 'Add option',
  label,
  deleteIconAction,
  deleteIconClassName,
  onUpdate,
  options,
}: CheckboxListBuilderProps) {
  const t = useCustomTranslation();
  const [allOptions, setAllOptions] = useState<EquipmentOption[]>(options || []);
  const [newOptionText, setNewOptionText] = useState<string>('');
  const [editingOption, setEditingOption] = useState<EquipmentOption | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Sync with parent options when they change
  useEffect(() => {
    setAllOptions(options || []);
  }, [options]);

  // Get currently checked options
  const checkedOptions = useMemo(() => {
    return allOptions.filter(option => option.is_checked);
  }, [allOptions]);

  // Get available options for the combobox (unchecked options)
  const availableOptions = useMemo(() => {
    return allOptions.filter(option => !option.is_checked);
  }, [allOptions]);

  // Handle checkbox state change
  const handleCheckboxChange = useCallback(
    (targetOption: EquipmentOption, checked: boolean): void => {
      const updatedOptions = allOptions.map(option =>
        option.option === targetOption.option ? { ...option, is_checked: checked } : option
      );
      setAllOptions(updatedOptions);
      onUpdate(updatedOptions);
    },
    [allOptions, onUpdate]
  );

  // Handle adding a new option from the combobox
  const handleAddOption = useCallback(() => {
    if (!newOptionText || newOptionText.trim() === '') {
      return;
    }

    const trimmedOption = newOptionText.trim();

    // Check if option already exists
    const existingOptionIndex = allOptions.findIndex(
      opt => opt.option.toLowerCase() === trimmedOption.toLowerCase()
    );

    let updatedOptions;
    if (existingOptionIndex >= 0) {
      // Option exists, just check it
      updatedOptions = allOptions.map((opt, index) =>
        index === existingOptionIndex ? { ...opt, is_checked: true } : opt
      );
    } else {
      // Option doesn't exist, add it as checked
      const newOption: EquipmentOption = {
        option: trimmedOption,
        is_checked: true,
      };
      updatedOptions = [...allOptions, newOption];
    }

    setAllOptions(updatedOptions);
    setNewOptionText('');
    onUpdate(updatedOptions);
  }, [allOptions, onUpdate, newOptionText]);

  // Handle creating a completely new option
  const handleCreateNewOption = useCallback(() => {
    if (!newOptionText || newOptionText.trim() === '') {
      return;
    }

    const trimmedOption = newOptionText.trim();

    // Check if option already exists
    const optionExists = allOptions.some(
      opt => opt.option.toLowerCase() === trimmedOption.toLowerCase()
    );

    if (optionExists) {
      return; // Don't create duplicate
    }

    const newOption: EquipmentOption = {
      option: trimmedOption,
      is_checked: true,
    };

    const updatedOptions = [...allOptions, newOption];
    setAllOptions(updatedOptions);
    setNewOptionText('');
    onUpdate(updatedOptions);
  }, [allOptions, onUpdate, newOptionText]);

  // Handle deleting an option completely
  const handleDeleteOption = useCallback(
    (targetOption: EquipmentOption) => {
      const updatedOptions = allOptions.filter(option => option.option !== targetOption.option);
      setAllOptions(updatedOptions);
      onUpdate(updatedOptions);
      deleteIconAction?.(targetOption.option);
    },
    [allOptions, onUpdate, deleteIconAction]
  );

  // Handle starting edit mode
  const handleEditStart = useCallback((option: EquipmentOption) => {
    setEditingOption(option);
    setEditValue(option.option);
  }, []);

  // Handle saving edit
  const handleEditSave = useCallback(() => {
    if (!editingOption || !editValue.trim()) return;

    const trimmedValue = editValue.trim();

    // Check if the new value conflicts with existing options
    const labelExists = allOptions.some(
      option =>
        option.option.toLowerCase() === trimmedValue.toLowerCase() &&
        option.option !== editingOption.option
    );

    if (labelExists) {
      return; // Don't allow duplicate names
    }

    const updatedOptions = allOptions.map(option =>
      option.option === editingOption.option ? { ...option, option: trimmedValue } : option
    );

    setAllOptions(updatedOptions);
    setEditingOption(null);
    setEditValue('');
    onUpdate(updatedOptions);
  }, [editingOption, editValue, allOptions, onUpdate]);

  // Handle canceling edit
  const handleEditCancel = useCallback(() => {
    setEditingOption(null);
    setEditValue('');
  }, []);

  // Handle keyboard events in edit mode
  const handleEditKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel]
  );

  // Handle combobox selection
  const handleComboboxChange = useCallback((selected: SelectOption) => {
    if (selected && selected.label && selected.label.trim() !== '') {
      setNewOptionText(String(selected.value || selected.label));
    }
  }, []);

  return (
    <div className="space-y-4">
      {label && <Label className="font-semibold text-sm">{label}</Label>}

      {/* Add new option section */}
      <div className="flex flex-wrap gap-2 items-start">
        <div className="flex-1 min-w-0">
          <ComboboxCustom
            key={`combobox-${availableOptions.length}`}
            options={availableOptions.map(option => ({
              value: option.option,
              label: option.option,
            }))}
            placeholder={t(placeholder)}
            value={newOptionText}
            onChange={handleComboboxChange}
            // onManualInputChange={handleManualInputChange}
            // allowCustomInput={true}
          />
        </div>

        <CustomButton
          className="mt-0.5 shrink-0"
          onClick={
            availableOptions.some(opt => opt.option === newOptionText)
              ? handleAddOption
              : handleCreateNewOption
          }
          type="button"
          disabled={!newOptionText.trim()}
        >
          {t('Add')}
        </CustomButton>
      </div>

      {/* Selected options list */}
      {checkedOptions.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {checkedOptions.map((option, index) => (
            <div
              key={`${option.option}-${index}`}
              className="flex items-center justify-between gap-2 relative border rounded-lg font-normal text-sm p-4"
            >
              {editingOption?.option === option.option ? (
                // Edit mode
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckboxCustom
                    id={`checkbox-edit-${option.option.replace(/\s+/g, '-')}-${index}`}
                    checked={option.is_checked}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange(option, checked)}
                    value={option.option}
                    className="cursor-pointer text-sm font-normal shrink-0"
                  />
                  <InputCustom
                    id={`edit-input-${index}`}
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    className="flex-1 min-w-0"
                    autoFocus
                  />
                </div>
              ) : (
                // View mode
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckboxCustom
                    id={`checkbox-${option.option.replace(/\s+/g, '-')}-${index}`}
                    checked={option.is_checked}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange(option, checked)}
                    label={option.option}
                    value={option.option}
                    className="cursor-pointer text-sm font-normal min-w-0"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-1 shrink-0">
                {editingOption?.option === option.option ? (
                  <>
                    <Check
                      width={16}
                      height={16}
                      onClick={handleEditSave}
                      className="cursor-pointer text-green-600 hover:text-green-800 transition-colors"
                    />
                    <X
                      width={16}
                      height={16}
                      onClick={handleEditCancel}
                      className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                    />
                  </>
                ) : (
                  <>
                    <SquarePen
                      width={16}
                      height={16}
                      onClick={() => handleEditStart(option)}
                      className={`cursor-pointer hover:text-blue-600 transition-colors ${deleteIconClassName || ''}`}
                      style={{
                        color: 'hsl(var(--muted-foreground))',
                      }}
                    />
                    <Trash2
                      width={16}
                      height={16}
                      onClick={() => handleDeleteOption(option)}
                      className={`cursor-pointer hover:text-red-600 transition-colors ${deleteIconClassName || ''}`}
                      style={{
                        color: 'hsl(var(--muted-foreground))',
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CheckboxListBuilder;
