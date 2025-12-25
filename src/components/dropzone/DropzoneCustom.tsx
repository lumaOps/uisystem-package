'use client';
import React from 'react';
import { Dropzone, DropzoneContent, DropzoneEmptyState, dropzoneFileType } from './dropzone';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { FieldValues, UseFormReturn, useWatch } from 'react-hook-form';

type DropzoneCustomProps = {
  name?: string;
  label?: string;
  id?: string;
  src?: dropzoneFileType[];
  onDrop?: (files: File[]) => void;
  onError?: (error: Error) => void;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  accept?: { [key: string]: string[] };
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (files: dropzoneFileType[]) => void;
  labelClassName?: string;
  tooltipContent?: string;
  description?: string;
  descriptionClassName?: string;
  formZodObject?: UseFormReturn<FieldValues>;
  errorMessage?: string;
  maxWidthFile?: number;
  maxHeightFile?: number;
  classNameUploadedImage?: string;
  classNameUploadedImageContainer?: string;
};

function DropzoneWithWatch(props: DropzoneCustomProps) {
  const { formZodObject, name, src } = props;

  const watchedValue = useWatch({
    control: formZodObject!.control,
    name: name!,
  });

  const effectiveSrc = Array.isArray(watchedValue) ? watchedValue : src;

  return (
    <DropzoneCustom {...props} src={effectiveSrc} formZodObject={undefined} name={undefined} />
  );
}

function DropzoneCustom(props: DropzoneCustomProps) {
  const {
    onError = console.error,
    maxSize = 1024 * 1024 * 10,
    minSize = 1024,
    maxFiles = 10,
    accept = { 'image/*': [] },
    multiple = true,
    disabled,
    className,
    onChange,
    onDrop,
    label,
    id,
    labelClassName,
    tooltipContent,
    description,
    descriptionClassName,
    src = [],
    name,
    formZodObject,
    errorMessage,
    maxHeightFile,
    maxWidthFile,
    classNameUploadedImage,
    classNameUploadedImageContainer,
  } = props;

  if (formZodObject && name) {
    return <DropzoneWithWatch {...props} />;
  }
  return (
    <div className="relative w-full p-1 pt-1">
      {label && (
        <Label
          htmlFor={id}
          className={cn('text-sm font-medium mb-1', labelClassName)}
          tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
          showTooltip={!!tooltipContent}
        >
          {label}
        </Label>
      )}

      {description && (
        <p className={cn('text-xs text-muted-foreground mb-1', descriptionClassName)}>
          {description}
        </p>
      )}

      <Dropzone
        maxSize={maxSize}
        minSize={minSize}
        maxFiles={maxFiles}
        accept={accept}
        onDrop={acceptedFiles => {
          onDrop?.(acceptedFiles);
        }}
        onFilesChange={onChange}
        onError={onError}
        src={src}
        maxWidthFile={maxWidthFile}
        maxHeightFile={maxHeightFile}
        multiple={multiple}
        disabled={disabled}
        className={cn(
          'relative w-full rounded-lg p-4 bg-background',
          errorMessage && 'border-destructive border-1',
          className
        )}
        classNameUploadedImage={classNameUploadedImage}
        classNameUploadedImageContainer={classNameUploadedImageContainer}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {errorMessage && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default DropzoneCustom;
