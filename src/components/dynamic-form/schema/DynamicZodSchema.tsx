import { componentDisplayType, ControlType } from '@/types/dynamic-form/dynamicForm';
import { z } from 'zod';

const regexCache = new Map<string, RegExp>();

function setNestedProperty(obj: Record<string, unknown>, path: string, value: z.ZodTypeAny): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (
      !Object.prototype.hasOwnProperty.call(current, key) ||
      typeof current[key] !== 'object' ||
      current[key] === null ||
      current[key] instanceof z.ZodType // Add this check to handle existing ZodTypes
    ) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}
function convertToZodObjects(obj: Record<string, unknown>): Record<string, z.ZodTypeAny> {
  const result: Record<string, z.ZodTypeAny> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof z.ZodType) {
      result[key] = value;
    } else if (
      value &&
      typeof value === 'object' &&
      !(value instanceof Date) &&
      !(value instanceof z.ZodType)
    ) {
      const nested = convertToZodObjects(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) {
        result[key] = z.object(nested);
      }
    }
  }

  return result;
}

// Helper function to apply common string controls
function applyStringControls(schema: z.ZodString, controls: ControlType[], label: string) {
  controls.forEach(control => {
    if (control.required) {
      schema = schema.nonempty({ message: control.message || `${label} is required.` });
    }
    if (control.minLength !== undefined) {
      schema = schema.min(control.minLength, { message: control.message });
    }
    if (control.maxLength !== undefined) {
      schema = schema.max(control.maxLength, { message: control.message });
    }
    if (control.length !== undefined) {
      schema = schema.length(control.length, { message: control.message });
    }
    if (control.email) {
      schema = schema.email({ message: control.message });
    }
    if (control.url) {
      schema = schema.url({ message: control.message });
    }
    if (control.uuid) {
      schema = schema.uuid({ message: control.message });
    }
    if (control.cuid) {
      schema = schema.cuid({ message: control.message });
    }
    if (control.pattern) {
      if (!regexCache.has(control.pattern)) {
        regexCache.set(control.pattern, new RegExp(control.pattern));
      }
      schema = schema.regex(regexCache.get(control.pattern)!, { message: control.message });
    }
    if (control.startsWith) {
      schema = schema.startsWith(control.startsWith, { message: control.message });
    }
    if (control.endsWith) {
      schema = schema.endsWith(control.endsWith, { message: control.message });
    }
    if (control.datetime) {
      schema = schema.datetime({ message: control.message });
    }
  });
  return schema;
}

function applyNumberControls(schema: z.ZodNumber, controls: ControlType[]) {
  controls.forEach(control => {
    if (control.min !== undefined) {
      schema = schema.min(control.min, { message: control.message });
    }
    if (control.max !== undefined) {
      schema = schema.max(control.max, { message: control.message });
    }
    if (control.int) {
      schema = schema.int({ message: control.message });
    }
    if (control.positive) {
      schema = schema.positive({ message: control.message });
    }
    if (control.nonNegative) {
      schema = schema.nonnegative({ message: control.message });
    }
    if (control.negative) {
      schema = schema.negative({ message: control.message });
    }
    if (control.multipleOf !== undefined) {
      schema = schema.multipleOf(control.multipleOf, { message: control.message });
    }
  });
  return schema;
}

const getRequiredMessage = (controls: ControlType[]): string | undefined => {
  return controls.find(c => c.required)?.message;
};

export function buildZodSchemaFromJson(
  jsonFields: (componentDisplayType | componentDisplayType[])[]
) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  const processFields = (fields: componentDisplayType[]) => {
    fields.forEach(field => {
      const label = field.label || field.name;
      const validations = field.validations || ({} as { controls?: ControlType[]; type?: string });
      const controls = validations.controls || [];
      switch (validations.type) {
        case 'string': {
          let schema = z.string();
          schema = applyStringControls(schema, controls, label);

          // Handle nested fields properly
          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }
        case 'array': {
          // Group controls by field name (like object)
          const groupedControls: Record<string, ControlType[]> = {};

          controls.forEach(control => {
            const fieldName = control.name || control.field || '';
            if (!groupedControls[fieldName]) {
              groupedControls[fieldName] = [];
            }
            groupedControls[fieldName].push(control);
          });

          // Build the object schema for array items
          const itemShape: Record<string, z.ZodTypeAny> = {};

          Object.entries(groupedControls).forEach(([fieldName, fieldControls]) => {
            let fieldSchema: z.ZodTypeAny;
            const fieldType = fieldControls[0].type;

            switch (fieldType) {
              case 'string':
                fieldSchema = applyStringControls(z.string(), fieldControls, fieldName);
                break;
              case 'number':
                fieldSchema = applyNumberControls(
                  z.number({
                    invalid_type_error: `${fieldName} must be a number.`,
                    required_error: `${fieldName} is required.`,
                  }),
                  fieldControls
                );
                break;
              case 'boolean':
                const requiredControl = fieldControls.find(c => c.required);
                fieldSchema = z
                  .boolean({
                    required_error: requiredControl?.message || 'This field is required.',
                  })
                  .refine(val => val === true, {
                    message: requiredControl?.message || 'You must accept the terms',
                  });
                break;
              case 'date':
                fieldSchema = z
                  .string({
                    required_error:
                      fieldControls.find(c => c.required)?.message || `${fieldName} is required.`,
                    invalid_type_error: `${fieldName} must be a string.`,
                  })
                  .refine(val => !isNaN(Date.parse(val)), {
                    message: `${fieldName} must be a valid date.`,
                  })
                  .transform(val => new Date(val));
                break;
              default:
                fieldSchema = z.any();
            }

            itemShape[fieldName] = fieldSchema;
          });

          // Create array of objects
          const schema = z.array(z.object(itemShape));
          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }

        case 'object': {
          // Group controls by field name (nested field path)
          const groupedControls: Record<string, ControlType[]> = {};

          controls.forEach(control => {
            const fieldName = control.name || control.field || '';
            if (!groupedControls[fieldName]) {
              groupedControls[fieldName] = [];
            }
            groupedControls[fieldName].push(control);
          });

          // Check if we have nested fields (containing dots)
          const hasNestedFields = Object.keys(groupedControls).some(
            fieldName => fieldName.includes('.') && fieldName.split('.').length > 1
          );

          if (hasNestedFields) {
            // Build nested object shape
            const objectShape: Record<string, z.ZodTypeAny> = {};

            Object.entries(groupedControls).forEach(([fieldName, fieldControls]) => {
              let fieldSchema: z.ZodTypeAny;
              const fieldType = fieldControls[0].type;
              const displayFieldName = fieldName.split('.').pop() || fieldName;

              switch (fieldType) {
                case 'string':
                  fieldSchema = applyStringControls(z.string(), fieldControls, displayFieldName);
                  break;
                case 'number':
                  fieldSchema = applyNumberControls(
                    z.number({
                      invalid_type_error: `${displayFieldName} must be a number.`,
                      required_error: `${displayFieldName} is required.`,
                    }),
                    fieldControls
                  );
                  break;
                case 'boolean':
                  const requiredControl = fieldControls.find(c => c.required);
                  fieldSchema = z
                    .boolean({
                      required_error:
                        requiredControl?.message || `${displayFieldName} is required.`,
                    })
                    .refine(val => val === true, {
                      message: requiredControl?.message || 'You must accept the terms',
                    });
                  break;
                case 'date':
                  fieldSchema = z
                    .string({
                      required_error:
                        fieldControls.find(c => c.required)?.message ||
                        `${displayFieldName} is required.`,
                      invalid_type_error: `${displayFieldName} must be a string.`,
                    })
                    .refine(val => !isNaN(Date.parse(val)), {
                      message: `${displayFieldName} must be a valid date.`,
                    })
                    .transform(val => new Date(val));
                  break;
                default:
                  fieldSchema = z.any();
              }

              const propertyName = fieldName.split('.').pop() || fieldName;
              objectShape[propertyName] = fieldSchema;
            });

            // Create the nested object schema
            const objectSchema = z.object(objectShape);

            // Set it under the field name
            if (field.name.includes('.')) {
              setNestedProperty(schemaShape, field.name, objectSchema);
            } else {
              schemaShape[field.name] = objectSchema;
            }
          } else {
            // No nested fields, create individual schemas
            Object.entries(groupedControls).forEach(([fieldName, fieldControls]) => {
              let fieldSchema: z.ZodTypeAny;
              const fieldType = fieldControls[0].type;

              switch (fieldType) {
                case 'string':
                  fieldSchema = applyStringControls(z.string(), fieldControls, fieldName);
                  break;
                case 'number':
                  fieldSchema = applyNumberControls(
                    z.number({
                      invalid_type_error: `${fieldName} must be a number.`,
                      required_error: `${fieldName} is required.`,
                    }),
                    fieldControls
                  );
                  break;
                case 'boolean':
                  const requiredControl = fieldControls.find(c => c.required);
                  fieldSchema = z
                    .boolean({
                      required_error: requiredControl?.message || `${fieldName} is required.`,
                    })
                    .refine(val => val === true, {
                      message: requiredControl?.message || 'You must accept the terms',
                    });
                  break;
                case 'date':
                  fieldSchema = z
                    .string({
                      required_error:
                        fieldControls.find(c => c.required)?.message || `${fieldName} is required.`,
                      invalid_type_error: `${fieldName} must be a string.`,
                    })
                    .refine(val => !isNaN(Date.parse(val)), {
                      message: `${fieldName} must be a valid date.`,
                    })
                    .transform(val => new Date(val));
                  break;
                default:
                  fieldSchema = z.any();
              }

              schemaShape[fieldName] = fieldSchema;
            });
          }
          break;
        }

        case 'number': {
          let schema = z.number({
            invalid_type_error: `${label} must be a number.`,
            required_error: `${label} is required.`,
          });
          schema = applyNumberControls(schema, controls);

          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }

        case 'boolean': {
          const requireMessage = getRequiredMessage(controls);
          const schema = z
            .boolean({
              required_error: requireMessage || 'You must accept the terms',
            })
            .refine(val => val === true, {
              message: 'You must accept the terms',
            });

          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }

        case 'date': {
          const requireMessage = getRequiredMessage(controls);

          const baseSchema = z
            .string({
              required_error: requireMessage || `${label} is required.`,
              invalid_type_error: `${label} must be a string.`,
            })
            .refine(val => !isNaN(Date.parse(val)), {
              message: `${label} must be a valid date.`,
            })
            .transform(val => new Date(val));

          const schema = baseSchema.refine(
            date => {
              return controls.every((control: ControlType) => {
                if (control.minDate) {
                  const min = new Date(control.minDate);
                  if (date < min) return false;
                }
                if (control.maxDate) {
                  const max = new Date(control.maxDate);
                  if (date > max) return false;
                }
                return true;
              });
            },
            {
              message: (() => {
                const minControl = controls.find((c: ControlType) => c.minDate);
                const maxControl = controls.find((c: ControlType) => c.maxDate);
                if (minControl && maxControl) {
                  return `${label} must be between ${new Date(minControl.minDate ?? '').toDateString()} and ${new Date(maxControl.maxDate ?? '').toDateString()}`;
                } else if (minControl) {
                  return `${label} must be after ${new Date(minControl.minDate ?? '').toDateString()}`;
                } else if (maxControl) {
                  return `${label} must be before ${new Date(maxControl.maxDate ?? '').toDateString()}`;
                }
                return `${label} is invalid.`;
              })(),
            }
          );

          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }

        case 'array': {
          let schema = z.array(z.any());

          controls.forEach((control: ControlType) => {
            if (control.length !== undefined) {
              schema = schema.length(control.length, { message: control.message });
            }
          });

          if (field.name.includes('.')) {
            setNestedProperty(schemaShape, field.name, schema);
          } else {
            schemaShape[field.name] = schema;
          }
          break;
        }

        default:
          // Handle unknown types - don't create placeholder schemas for nested objects
          if (!field.name.includes('.')) {
            schemaShape[field.name] = z.any();
          }
          break;
      }
    });
  };

  jsonFields.forEach(item => {
    if (Array.isArray(item)) {
      processFields(item);
    } else {
      processFields([item]);
    }
  });

  // Convert nested plain objects to proper Zod object schemas
  const finalSchemaShape = convertToZodObjects(schemaShape);

  return z.object(finalSchemaShape);
}
