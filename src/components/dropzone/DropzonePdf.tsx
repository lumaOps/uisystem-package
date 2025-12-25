'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { FieldValues, UseFormReturn, useWatch } from 'react-hook-form';
import { FileText, Trash2, CloudUpload, UploadIcon } from 'lucide-react';
import { CustomButton } from '@/components/button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { toast } from 'sonner';
import { truncateFileName } from '@/utils/helpers/helperFunctions';
import { dropzoneFileType, DropZoneUploadState } from './dropzone';
import { useHelperMutations } from '@/hooks/queries/helpers/useHelperMutations';

type DropzonePdfProps = {
  name?: string;
  label?: string;
  id?: string;
  src?: dropzoneFileType[];
  onDrop?: (files: dropzoneFileType[]) => void;
  onError?: (error: Error) => void;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (files: dropzoneFileType[]) => void;
  labelClassName?: string;
  tooltipContent?: string;
  description?: string;
  descriptionClassName?: string;
  formZodObject?: UseFormReturn<FieldValues>;
};

// Helper function to get file name
export const getFileName = (file: dropzoneFileType): string => {
  if (typeof file === 'string') {
    return file.split('/').pop() || file;
  }

  if (file instanceof File) {
    return file.name;
  }
  if ('original_name' in file && typeof file.original_name === 'string') {
    return file.original_name || '';
  }
  if ('file_name' in file && typeof file.file_name === 'string') {
    return file.file_name || '';
  }

  return 'unknown';
};
// Helper function to format file size
const formatFileSize = (size: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let fileSize = size;
  let unitIndex = 0;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

// PDF List Component
const PdfFilesList: React.FC<{
  pdfFiles: dropzoneFileType[];
  onRemove: (index: number) => void;
}> = ({ pdfFiles, onRemove }) => {
  if (pdfFiles.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-foreground">PDF Files</h4>
      <div className="space-y-2">
        {pdfFiles.map((file, index) => (
          <div
            key={`pdf-${index}-${getFileName(file)}`}
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border hover:bg-muted/90 transition-colors w-full overflow-hidden"
          >
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-destructive" />
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate mb-1" title={getFileName(file)}>
                {truncateFileName(getFileName(file), 30)}
              </p>
              {typeof file !== 'string' && (
                <p className="text-xs text-muted-foreground truncate">
                  {file instanceof File && formatFileSize(file.size)}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 ml-2 flex gap-1">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function DropzonePdfWithWatch(props: DropzonePdfProps) {
  const { formZodObject, name, src } = props;

  const watchedValue = useWatch({
    control: formZodObject!.control,
    name: name!,
  });

  const effectiveSrc = Array.isArray(watchedValue) ? watchedValue : src;

  return <DropzonePdf {...props} src={effectiveSrc} formZodObject={undefined} name={undefined} />;
}

function DropzonePdf(props: DropzonePdfProps) {
  const {
    onError = console.error,
    maxSize = 1024 * 1024 * 10, // 10MB default
    minSize = 1024,
    maxFiles = 5,
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
  } = props;

  const t = useCustomTranslation();
  const [files, setFiles] = useState<dropzoneFileType[]>(src);
  const { uploadMedia } = useHelperMutations();
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [stateOfUploading, setStateOfUploading] = useState<{
    uploaded: number;
    total: number;
  }>({
    uploaded: 0,
    total: 0,
  });
  // Update files when src prop changes
  React.useEffect(() => {
    setFiles(src);
  }, [src]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploadLoading(true);
        const remainingSlots = maxFiles - files.length;
        const validFiles = acceptedFiles.slice(0, remainingSlots);
        const excessFiles = acceptedFiles.slice(remainingSlots);
        setStateOfUploading({ total: validFiles.length, uploaded: 0 });

        const uploadedImagesInServer: dropzoneFileType[] = [];

        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const formData = new FormData();
          formData.append('file', file);
          try {
            const response = await uploadMedia(formData);
            if ('data' in response && response.data) {
              uploadedImagesInServer.push(response.data as dropzoneFileType);
              setStateOfUploading({
                total: validFiles.length,
                uploaded: i + 1,
              });
            }
          } catch (error: unknown) {
            console.error(error);
            toast.error(t('Upload failed'), {
              description: t(`File "${file.name}" could not be uploaded.`),
            });
          }
        }
        const newFiles = [...files, ...uploadedImagesInServer];
        setIsUploadLoading(false);
        setFiles(newFiles);
        onChange?.(newFiles);
        onDrop?.(validFiles);

        if (excessFiles.length > 0) {
          toast.error('File limit exceeded', {
            description: `Maximum ${maxFiles} files allowed. ${excessFiles.length} file(s) were not added.`,
          });
        }
      }

      if (fileRejections.length > 0) {
        toast.error('File upload error', {
          description: 'Only PDF files are allowed.',
        });
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [files, maxFiles, onChange, onDrop]
  );

  const handleRemove = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles,
    maxSize,
    minSize,
    onDrop: handleDrop,
    disabled,
    onError,
  });

  if (formZodObject && name) {
    return <DropzonePdfWithWatch {...props} />;
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

      {/* PDF Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative h-auto w-full overflow-hidden p-8 flex flex-col gap-2.5 rounded-md border-2 transition-colors duration-200 ease-in-out min-h-32',
          'border-dashed border-muted-foreground/25 hover:border-primary/50',
          isDragActive && 'outline-none ring-1 ring-ring border-primary',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input {...getInputProps()} disabled={disabled} />

        {/* Empty State */}
        <div className="w-full flex flex-col gap-3 text-center justify-center">
          <div className="flex w-full text-center justify-center">
            <div className="flex size-8 items-center justify-center rounded-md bg-background border text-muted-foreground h-10 w-10">
              <CloudUpload width={17} height={15} className="text-primary" />
            </div>
          </div>

          <p className="w-full truncate text-muted-foreground text-xs">
            <span className="font-bold">{t('Click to upload PDF')}</span> {t('or drag and drop')}
          </p>
          <p className="text-muted-foreground text-xs">
            {t('PDF files only. Max size:')}{' '}
            {maxSize ? `${(maxSize / (1024 * 1024)).toFixed(0)}MB` : '10MB'}
          </p>
          <div className="flex w-full text-center justify-center">
            <CustomButton
              positionIcon="left"
              icon={<UploadIcon size={16} />}
              variant="default"
              className="w-full mt-2 max-w-36 text-xs"
              type="button"
            >
              {t('Upload PDF')} {maxFiles > 1 ? t('files') : t('file')}
            </CustomButton>
          </div>
        </div>
        <DropZoneUploadState
          uploaded={stateOfUploading.uploaded}
          total={stateOfUploading.total}
          isLoading={isUploadLoading}
        />
      </div>

      {/* PDF Files List - Displayed beneath the dropzone */}
      <PdfFilesList pdfFiles={files} onRemove={handleRemove} />
    </div>
  );
}

export default DropzonePdf;
