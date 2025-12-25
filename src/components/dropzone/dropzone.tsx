'use client';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { cn } from '@/utils/utils';
import { CloudUpload, Move, Plus, Trash2, UploadIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Accept, DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone';
import { CustomButton } from '../button/CustomButton';
import { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { toast } from 'sonner';
import { useHelperMutations } from '@/hooks/queries/helpers/useHelperMutations';
import { ProgressCustom } from '../progress/ProgressCustom';

export type dropzoneFileType = File | string | Record<string, unknown>;
type DropzoneContextType = {
  src?: dropzoneFileType[];
  accept?: DropzoneOptions['accept'];
  maxSize?: DropzoneOptions['maxSize'];
  minSize?: DropzoneOptions['minSize'];
  maxFiles?: DropzoneOptions['maxFiles'];
  onFilesUpdate?: (updater: (prev: dropzoneFileType[]) => dropzoneFileType[]) => void;
  disabled?: boolean;
  maxWidthFile?: number;
  maxHeightFile?: number;
  classNameUploadedImage?: string;
  classNameUploadedImageContainer?: string;
  isLoading?: boolean;
  uploadState?: {
    total: number;
    uploaded: number;
  };
  onUploadStateChange?: (state: { total: number; uploaded: number }) => void;
  onIsLoadingChange?: (isLoading: boolean) => void;
};

const renderBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
  src?: dropzoneFileType[];
  className?: string;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void;
  onFilesChange?: (files: dropzoneFileType[]) => void;
  children?: ReactNode;
  maxWidthFile?: number;
  maxHeightFile?: number;
  classNameUploadedImage?: string;
  classNameUploadedImageContainer?: string;
  isLoading?: boolean;
};

export const Dropzone = ({
  accept,
  maxFiles = 20,
  maxSize,
  minSize,
  onDrop,
  onFilesChange,
  onError,
  disabled,
  src: initialSrc = [],
  className,
  children,
  maxWidthFile,
  maxHeightFile,
  classNameUploadedImage,
  classNameUploadedImageContainer,
  ...props
}: DropzoneProps) => {
  const [files, setFiles] = useState<dropzoneFileType[]>(initialSrc);
  const t = useCustomTranslation();
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [stateOfUploading, setStateOfUploading] = useState<{
    uploaded: number;
    total: number;
  }>({
    uploaded: 0,
    total: 0,
  });

  const { uploadMedia } = useHelperMutations();

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = () => {
        const isWidthValid = typeof maxWidthFile === 'number' ? img.width <= maxWidthFile : true;
        const isHeightValid =
          typeof maxHeightFile === 'number' ? img.height <= maxHeightFile : true;

        resolve(isWidthValid && isHeightValid);
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        console.error('Failed to load image');
        URL.revokeObjectURL(img.src);
        resolve(false);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
      if (acceptedFiles.length > 0) {
        // Check file limit before processing
        const maxLimit = maxFiles ?? 20;
        const prevLength = files.length;
        const acceptedLength = acceptedFiles.length;

        if (prevLength + acceptedLength > maxLimit) {
          toast.error(t('File limit exceeded'), {
            description: t(
              `Maximum ${maxLimit} files allowed. ${acceptedLength} file(s) were not added.`
            ),
          });
          return;
        }

        // Validate dimensions in parallel
        const validations = await Promise.all(
          acceptedFiles.map(file => checkImageDimensions(file))
        );

        const validFiles = acceptedFiles.filter((file, i) => validations[i]);

        if (validFiles.length < acceptedFiles.length) {
          toast.error(t('File upload error', { defaultValue: 'File upload error' }), {
            description:
              t('The uploaded image size') +
              ' x:' +
              maxWidthFile +
              ' y:' +
              maxHeightFile +
              ' ' +
              t('files.'),
          });
        }

        // ✅ Upload to API if there are valid files
        if (validFiles.length > 0) {
          setIsUploadLoading(true);
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

          // Add uploaded files to state
          setFiles(prev => {
            const combined = [...prev, ...uploadedImagesInServer];
            const limited = combined.slice(0, maxLimit);
            return limited;
          });

          setIsUploadLoading(false);
        }
      }

      if (fileRejections.length > 0 && onError) {
        toast.error(t('File upload error', { defaultValue: 'File upload error' }), {
          description: t('You can only upload up to') + ' ' + maxFiles + ' ' + t('files.'),
        });
      }

      onDrop?.(acceptedFiles, fileRejections, event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDrop, maxFiles, onError, t, maxWidthFile, maxHeightFile, files.length, uploadMedia]
  );

  const handleFilesUpdate = useCallback(
    async (updater: (prev: dropzoneFileType[]) => dropzoneFileType[]) => {
      setFiles(prev => updater(prev));
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop: handleDrop,
    disabled,
    onError,
    ...props,
  });

  useEffect(
    () => {
      setFiles(prev => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(initialSrc);
        if (prevStr !== nextStr) return initialSrc;
        return prev;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialSrc)]
  );

  const handleOnIsLoadingChange = (isLoading: boolean) => {
    setIsUploadLoading(isLoading);
  };

  const handleOnUploadStateChange = (state: { total: number; uploaded: number }) => {
    setStateOfUploading(prev => ({ ...prev, ...state }));
  };

  return (
    <DropzoneContext.Provider
      value={{
        src: files,
        accept,
        maxSize,
        minSize,
        maxFiles,
        onFilesUpdate: handleFilesUpdate,
        disabled,
        maxWidthFile,
        maxHeightFile,
        classNameUploadedImage,
        classNameUploadedImageContainer,
        isLoading: isUploadLoading,
        onIsLoadingChange: handleOnIsLoadingChange,
        uploadState: stateOfUploading,
        onUploadStateChange: handleOnUploadStateChange,
      }}
    >
      <div
        className={cn(
          'relative h-auto w-full overflow-hidden p-8 flex flex-col gap-2.5 rounded-md border-2 transition-colors duration-200 ease-in-out min-h-56',
          isDragActive && 'outline-none ring-1 ring-ring',
          className
        )}
        {...getRootProps()}
      >
        {files.length === 0 && (
          <input {...getInputProps()} disabled={disabled} accept={normalizeAccept(accept)} />
        )}
        {children}
        <DropZoneUploadState
          uploaded={stateOfUploading.uploaded}
          total={stateOfUploading.total}
          isLoading={isUploadLoading}
        />
      </div>
    </DropzoneContext.Provider>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone');
  }

  return context;
};

export type DropzoneContentProps = {
  children?: ReactNode;
};

const maxLabelItems = 100;

// Memoized FileItem component to prevent unnecessary re-renders
const FileItem = React.memo(
  ({
    item,
    index,
    onDelete,
    classNameUploadedImage,
    classNameUploadedImageContainer,
    removeSorting,
  }: {
    item: File | { url?: string; name?: string } | string;
    index: number;
    onDelete: (index: number) => void;
    classNameUploadedImage?: string;
    classNameUploadedImageContainer?: string;
    removeSorting?: boolean;
  }) => {
    const t = useCustomTranslation();
    const blobUrlRef = useRef<string | null>(null);

    // Use useMemo to create stable preview URL that doesn't change during re-renders
    const previewUrl = useMemo(() => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'object' && item && 'url' in item && item.url) {
        return item.url;
      } else if (item instanceof File) {
        if (!blobUrlRef.current) {
          blobUrlRef.current = URL.createObjectURL(item);
        }
        return blobUrlRef.current;
      }
      return '';
    }, [item]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (blobUrlRef.current && item instanceof File) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
      };
    }, [item]);

    const itemKey = useMemo(() => {
      if (typeof item === 'string') return `str-${item}`;
      if (typeof item === 'object' && item && 'url' in item) return `obj-${item.url || index}`;
      if (item instanceof File) return `file-${item.name}-${item.size}-${index}`;
      return `item-${index}`;
    }, [item, index]);

    const altText = useMemo(() => {
      if (typeof item === 'string') return `Preview ${index + 1}`;
      if (typeof item === 'object' && item && 'name' in item)
        return item.name || `File ${index + 1}`;
      if (item instanceof File) return item.name || `File ${index + 1}`;
      return `File ${index + 1}`;
    }, [item, index]);

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(index);
      },
      [index, onDelete]
    );

    return (
      <div key={itemKey} data-id={itemKey} className="relative flex">
        <div
          className={cn(
            'group relative overflow-hidden rounded-md border hover:scale-105 hover:shadow-lg hover:shadow-primary/20 w-40 h-28 cursor-pointer',
            classNameUploadedImageContainer
          )}
        >
          {previewUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={altText}
                className={cn(
                  'rounded-md object-cover w-40 h-28 cursor-pointer',
                  classNameUploadedImage
                )}
                loading="lazy"
                onError={() => {
                  console.warn('Image failed to load:', previewUrl);
                }}
              />
            </>
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-md bg-gradient-to-t from-black/70 to-transparent z-10"></div>

          <div className="absolute top-1 right-1 z-20">
            <div
              onClick={handleDelete}
              className="p-2 rounded-full transition-all duration-200 transform cursor-pointer hover:bg-destructive/20"
              title={t('Delete')}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
          </div>
          {!removeSorting && (
            <div className="absolute top-1 left-1 z-20">
              <div
                className="p-2 rounded-full transition-all duration-200 transform cursor-move"
                title={t('Drag to reorder')}
              >
                <Move className="w-4 h-4 text-background fill-background" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
FileItem.displayName = 'FileItem';

export const DropzoneContent = ({ children }: { children?: React.ReactNode }) => {
  const { src, onFilesUpdate, classNameUploadedImage, classNameUploadedImageContainer } =
    useDropzoneContext();

  const t = useCustomTranslation();

  const sortableList = useMemo(() => {
    if (!src) return [];
    return src.map((item, index) => {
      // Create more stable IDs
      const itemId =
        typeof item === 'string'
          ? `str-${item.slice(-10)}-${index}` // Use last 10 chars + index for strings
          : typeof item === 'object' && 'url' in item
            ? `obj-${(item?.url as string)?.slice(-10) || 'unknown'}-${index}`
            : `file-${(item as File).name || 'unnamed'}-${index}`;

      return {
        id: itemId,
        file: item,
        originalIndex: index,
      };
    });
  }, [src]);

  const handleSort = useCallback(
    (newList: typeof sortableList) => {
      // Add validation to prevent invalid states
      if (!Array.isArray(newList) || newList.length === 0) return;

      const reorderedFiles = newList.map(i => i.file).filter(Boolean); // Filter out any undefined items
      if (typeof onFilesUpdate === 'function') {
        onFilesUpdate(() => reorderedFiles);
      }
    },
    [onFilesUpdate]
  );

  const handleDelete = useCallback(
    (indexToDelete: number) => {
      if (typeof onFilesUpdate === 'function') {
        onFilesUpdate(prev => prev.filter((_, index) => index !== indexToDelete));
      }
    },
    [onFilesUpdate]
  );

  if (!src || src.length === 0) return null;
  if (children) return <>{children}</>;
  const removeSorting = sortableList.length > 1 ? false : true;
  return (
    <div className="flex flex-wrap">
      <div className="flex-1 w-full">
        <ReactSortable
          list={sortableList}
          setList={handleSort}
          animation={200}
          easing="ease-out"
          filter=".addImageButtonContainer"
          ghostClass="drag-ghost"
          chosenClass="sortable-chosen"
          dragClass="sortable-drag"
          handle=".cursor-move"
          tag="div"
          className={cn(
            'grid gap-2',
            classNameUploadedImage?.includes('w-full')
              ? 'grid-cols-[repeat(auto-fill,_minmax(100%,_1fr))]'
              : 'grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))]'
          )}
          delayOnTouchOnly={true}
          delay={100}
          // Add these props for better stability
          forceFallback={false}
          fallbackOnBody={true}
          swapThreshold={0.65}
          invertSwap={false}
        >
          {sortableList.length > maxLabelItems ? (
            <>
              {sortableList.slice(0, maxLabelItems).map(({ file, id }, index) => (
                // Ensure each item is wrapped in a proper container with stable key
                <div key={id} className="sortable-item">
                  <FileItem
                    item={file}
                    index={index}
                    onDelete={handleDelete}
                    classNameUploadedImage={classNameUploadedImage}
                    classNameUploadedImageContainer={classNameUploadedImageContainer}
                  />
                </div>
              ))}
              <div className="flex items-center justify-center" key="more-indicator">
                <span className="text-sm text-muted-foreground px-3 py-2 bg-muted/50 rounded-md">
                  {t('and')} {sortableList.length - maxLabelItems} {t('more')}
                </span>
              </div>
            </>
          ) : (
            sortableList.map(({ file, id }, index) => (
              // Ensure each item is wrapped in a proper container with stable key
              <div key={id} className="sortable-item">
                <FileItem
                  item={file}
                  index={index}
                  onDelete={handleDelete}
                  classNameUploadedImage={classNameUploadedImage}
                  classNameUploadedImageContainer={classNameUploadedImageContainer}
                  removeSorting={removeSorting}
                />
              </div>
            ))
          )}

          <div className="addImageButtonContainer" key="add-button">
            <DropzoneAddImage />
          </div>
        </ReactSortable>
      </div>
    </div>
  );
};

export type DropzoneEmptyStateProps = {
  children?: ReactNode;
};

export const DropzoneEmptyState = ({ children }: DropzoneEmptyStateProps) => {
  const t = useCustomTranslation();
  const { src, maxSize, maxFiles, maxWidthFile, maxHeightFile, accept } = useDropzoneContext();
  const acceptedExtensions = Object.values(accept || {})
    .flat()
    .join(', ');

  if (src && src.length > 0) {
    return null;
  }

  if (children) {
    return children;
  }

  return (
    <div className="w-full flex flex-col gap-3 text-center justify-center">
      <div className="flex w-full text-center justify-center">
        <div className="flex size-8 items-center justify-center rounded-md bg-background border text-muted-foreground h-10 w-10">
          <CloudUpload width={17} height={15} className="text-primary" />
        </div>
      </div>

      <p className="w-full truncate text-muted-foreground text-xs">
        <span className="font-bold">{t('Click to upload')}</span> {t('or drag and drop')}
      </p>
      <p className="text-muted-foreground text-xs">
        {`
    ${maxWidthFile && maxHeightFile ? t('Max') + ` ${maxWidthFile}x${maxHeightFile}px | ` : ''}
    ${acceptedExtensions ? acceptedExtensions.replace(/\./g, '').toUpperCase() + ' | ' : ''}
    ${maxSize ? renderBytes(maxSize) : '20MP'} ${t('max')}.
  `}
      </p>

      <div className="flex w-full text-center justify-center">
        <CustomButton
          positionIcon="left"
          icon={<UploadIcon size={16} />}
          variant="default"
          className="mt-2 flex text-xs"
          type="button"
        >
          {t('Upload your')} {maxFiles === 1 ? t('a file') : t('files')}
        </CustomButton>
      </div>
    </div>
  );
};

export type DropZoneUploadStateProps = {
  uploaded: number;
  total: number;
  isLoading: boolean;
};

export const DropZoneUploadState = ({ uploaded, total, isLoading }: DropZoneUploadStateProps) => {
  const t = useCustomTranslation();

  if (!isLoading) return null;

  const percentage = total === 0 ? 0 : Math.round((uploaded / total) * 100);

  return (
    <div className="absolute inset-0 z-20 bg-background/90 flex flex-col items-center justify-center gap-4 text-primary rounded-lg">
      <div className="text-sm font-medium">
        {t('Uploading files...')} {uploaded}/{total}
      </div>
      <ProgressCustom
        initialValue={0}
        targetValue={percentage}
        duration={400}
        className="w-3/4 h-2 bg-muted"
        indicatorClassName="bg-primary"
      />
    </div>
  );
};

export const DropzoneAddImage = () => {
  const { onFilesUpdate, disabled, maxFiles, src, accept, onUploadStateChange, onIsLoadingChange } =
    useDropzoneContext();

  const t = useCustomTranslation();
  const { uploadMedia } = useHelperMutations();

  const { getRootProps, getInputProps } = useDropzone({
    noClick: false,
    noDrag: true,
    multiple: true,
    disabled,
    accept,
    onDrop: async acceptedFiles => {
      if (typeof onFilesUpdate !== 'function') return;

      const maxLimit = maxFiles ?? 20;
      const prevLength = src?.length ?? 0;
      const acceptedLength = acceptedFiles.length;

      if (prevLength + acceptedLength > maxLimit) {
        toast.error(t('File limit exceeded'), {
          description: t(
            `Maximum ${maxLimit} files allowed. ${acceptedLength} file(s) were not added.`
          ),
        });
        return;
      }

      onIsLoadingChange?.(true);
      onUploadStateChange?.({ total: acceptedLength, uploaded: 0 });

      const uploadedImagesInServer: dropzoneFileType[] = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await uploadMedia(formData);
          if ('data' in response && response.data) {
            uploadedImagesInServer.push(response.data as dropzoneFileType);
            onUploadStateChange?.({
              total: acceptedLength,
              uploaded: i + 1,
            });
          }
        } catch (error: unknown) {
          console.log(error);
          toast.error(t('Upload failed'), {
            description: t(`File "${file.name}" could not be uploaded.`),
          });
        }
      }

      onFilesUpdate(prev => [...prev, ...uploadedImagesInServer]);
      onIsLoadingChange?.(false);
    },
  });

  if (src && src.length >= (maxFiles ?? 20)) {
    return null;
  }

  return (
    <div {...getRootProps()} className="relative ">
      <input {...getInputProps()} accept={normalizeAccept(accept)} />
      <div className="flex flex-col justify-center text-center w-40 h-28 bg-muted border rounded-lg cursor-pointer  group">
        <div className="flex flex-wrap text-center justify-center">
          <Plus className="bg-forground group-hover:scale-110 group-hover:text-primary" size={16} />
        </div>
      </div>
    </div>
  );
};

const normalizeAccept = (accept: string | Accept | undefined): string => {
  if (typeof accept === 'string') return accept;
  if (typeof accept === 'object' && accept !== null) {
    return Object.keys(accept).join(',');
  }
  return 'image/*';
};
