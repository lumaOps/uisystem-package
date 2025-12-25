'use client';

import { Controller, useWatch } from 'react-hook-form';
import { ComboboxCustom } from '../combobox/ComboboxCustom';
import type {
  MultipleSelectsProps,
  SelectConfig,
  SelectOption,
} from '@/types/common/multiple-select/multipleSelect';
import { useState, useCallback, useMemo, useEffect } from 'react';

export function MultipleSelectCustom({
  configs,
  data,
  onChange,
  control,
  errors = {},
  className = '',
  setValue,
  watch,
  disabled = false,
}: MultipleSelectsProps) {
  const [selections, setSelections] = useState<Record<string, string | number>>({});
  const [isSelectionsInitialized, setIsSelectionsInitialized] = useState(false);

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const initialSelections: Record<string, string | number> = {};
    configs.forEach(config => {
      const value = watchedValues?.[config.name];
      if (value !== undefined && value !== '') {
        initialSelections[config.name] = value;
      }
    });
    setSelections(initialSelections);
  }, [configs, watchedValues]);

  const [customOptions, setCustomOptions] = useState<Record<string, SelectOption[]>>({});

  const getCustomKey = useCallback(
    (
      fieldName: string,
      currentSelections: Record<string, string | number>,
      dependsOn: string[] = []
    ) => {
      const dependencyValues = dependsOn
        .map(dep => `${dep}:${currentSelections[dep] ?? 'null'}`)
        .join('__'); // Join with a separator to avoid ambiguity

      return dependencyValues ? `${fieldName}__${dependencyValues}` : fieldName;
    },
    [] // No dependencies as it only uses its arguments
  );

  const getOptionsForConfig = useCallback(
    (config: SelectConfig, currentSelections: Record<string, string | number>): SelectOption[] => {
      let baseOptions: SelectOption[] = [];

      if (!config.dependsOn?.length) {
        baseOptions = (data[config.name] as SelectOption[]) || [];
      } else {
        let currentLevelData = data[config.name];

        const hasMissingDependency = config.dependsOn.some(dep => {
          const depValue = currentSelections[dep];
          const isMissing = !depValue || depValue === '' || depValue === null;
          return isMissing;
        });

        if (hasMissingDependency) {
          return [];
        }

        for (const dep of config.dependsOn) {
          const depValue = currentSelections[dep];

          if (
            currentLevelData &&
            typeof currentLevelData === 'object' &&
            !Array.isArray(currentLevelData)
          ) {
            currentLevelData = (
              currentLevelData as Record<
                string,
                | SelectOption[]
                | Record<string, SelectOption[]>
                | Record<string, Record<string, SelectOption[]>>
              >
            )[String(depValue)];
          } else {
            currentLevelData = [];
            break;
          }
        }

        if (Array.isArray(currentLevelData)) {
          baseOptions = currentLevelData;
        } else {
          baseOptions = [];
        }
      }

      const customKey = getCustomKey(config.name, currentSelections, config.dependsOn);
      const customOptionsForContext = customOptions[customKey] || [];
      const mergedOptions = [...baseOptions];
      customOptionsForContext.forEach(customOpt => {
        if (!mergedOptions.some(baseOpt => String(baseOpt.value) === String(customOpt.value))) {
          mergedOptions.push(customOpt);
        }
      });
      return mergedOptions;
    },
    [data, customOptions, getCustomKey] // getCustomKey is stable due to useCallback
  );

  const isConfigDisabled = useCallback(
    (config: SelectConfig, currentSelections: Record<string, string | number>): boolean => {
      // A field is disabled if it has dependencies and any of those dependencies are not selected.
      return (
        config.dependsOn?.some(dep => !currentSelections[dep] || currentSelections[dep] === '') ??
        false
      );
    },
    [] // No dependencies as it only uses its arguments
  );

  const getDependentConfigs = useCallback(
    (changedConfigName: string): string[] => {
      const dependentsToClear: string[] = [];
      const collectDependents = (targetConfigName: string) => {
        configs.forEach(config => {
          if (
            config.dependsOn?.includes(targetConfigName) &&
            !dependentsToClear.includes(config.name)
          ) {
            dependentsToClear.push(config.name);
            collectDependents(config.name);
          }
        });
      };
      collectDependents(changedConfigName);
      return dependentsToClear;
    },
    [configs]
  );
  const [pendingClears, setPendingClears] = useState<string[]>([]);

  const handleSelectChange = useCallback(
    (configName: string, value: number | string) => {
      setSelections(currentSelections => {
        const newSelections = { ...currentSelections, [configName]: value };

        const dependentsToClear = getDependentConfigs(configName);
        dependentsToClear.forEach(dependentName => {
          delete newSelections[dependentName];
        });

        // Schedule clearing values in RHF after render
        setPendingClears(dependentsToClear);

        onChange?.(newSelections);
        return newSelections;
      });
    },
    [getDependentConfigs, onChange]
  );

  // Run setValue in a safe render-independent phase
  useEffect(() => {
    if (!pendingClears.length || !setValue) return;

    pendingClears.forEach(dep => setValue(dep, ''));
    setPendingClears([]); // Reset after applying
  }, [pendingClears, setValue]);

  const handleAddCustomOption = useCallback(
    (configName: string, newOption: SelectOption, configDependsOn: string[] = []) => {
      const customKey = getCustomKey(configName, selections, configDependsOn); // Use current selections
      setCustomOptions(prev => {
        const existing = prev[customKey] || [];
        const optionExists = existing.some(opt => String(opt.value) === String(newOption.value));
        if (optionExists) {
          return prev;
        }
        return {
          ...prev,
          [customKey]: [...existing, newOption],
        };
      });
    },
    [getCustomKey, selections] // selections is a dependency here for getCustomKey
  );

  const handleComboboxChange = useCallback(
    (
      configName: string,
      value: { label: string; value: string | number },
      configOptions: SelectOption[],
      dependsOn: string[] = [],
      fieldOnChange: (val: string | number) => void
    ) => {
      const optionExists = configOptions.some(opt => String(opt.value) === String(value.value));

      if (!optionExists) {
        handleAddCustomOption(configName, { label: value.label, value: value.value }, dependsOn);
      }

      fieldOnChange(value.value); // Update react-hook-form
      handleSelectChange(configName, value.value); // Update local state and clear dependents
    },
    [handleAddCustomOption, handleSelectChange]
  );

  // This useMemo will re-calculate options and disabled states whenever 'selections' or 'customOptions' change.
  const configsWithOptions = useMemo(() => {
    const updatedConfigs = configs.map((config: SelectConfig) => ({
      ...config,
      options: getOptionsForConfig(config, selections),
      disabled: isConfigDisabled(config, selections),
    }));
    return updatedConfigs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs, selections, customOptions, getOptionsForConfig, isConfigDisabled]); // Explicit dependencies

  // Effect to initialize selections from external form values if they exist, once.
  // This helps when the form is pre-populated.
  useEffect(() => {
    if (!isSelectionsInitialized && watch) {
      const initialSelectionsFromWatch: Record<string, string | number> = {};
      configs.forEach(config => {
        const value = watch(config.name);
        if (value !== undefined && value !== '') {
          initialSelectionsFromWatch[config.name] = value;
        }
      });
      setSelections(initialSelectionsFromWatch);
      setIsSelectionsInitialized(true);
    }
  }, [configs, watch, isSelectionsInitialized]);
  const getNestedErrorMessage = (errors: unknown, path: string): string | undefined => {
    const result = path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, errors);

    // Only return message if it exists and is a string
    if (result && typeof result === 'object' && 'message' in result) {
      const maybeMessage = (result as Record<string, unknown>).message;
      return typeof maybeMessage === 'string' ? maybeMessage : undefined;
    }

    return undefined;
  };

  return (
    <div className={`flex flex-wrap gap-2  ${className}`}>
      {configsWithOptions.map(configWithOptions => (
        <div key={configWithOptions.name} className="flex-1">
          <Controller
            name={configWithOptions.name}
            control={control}
            render={({ field }) => (
              <ComboboxCustom
                options={configWithOptions.options || []}
                label={configWithOptions.label}
                placeholder={configWithOptions.placeholder || `Select ${configWithOptions.label}`}
                onChange={value =>
                  handleComboboxChange(
                    configWithOptions.name,
                    value,
                    configWithOptions.options || [],
                    configWithOptions.dependsOn,
                    field.onChange
                  )
                }
                name={configWithOptions.name}
                value={field.value || ''}
                disabled={configWithOptions.disabled || Boolean(disabled)}
                errorMessage={getNestedErrorMessage(errors, configWithOptions.name) ?? undefined}
                isMultiple={false} // Assuming these are single selects based on your structure
                tooltipContent={configWithOptions.tooltipContent}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
}
