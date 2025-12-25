'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import { cn } from '@/utils/utils';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from './table';
import { CheckboxCustom } from '../checkbox/CheckboxCustom';

import type { CustomTableProps } from '@/types/common/table/tablecustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { LoadingCustom } from '../loading';
import { CustomButton } from '@/components/button/CustomButton';
import StatusCard from '../card/StatusCard';

export const TableCustom = <T extends { uuid: string; itemClassName?: string }>({
  caption,
  headers,
  rows,
  footer,
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  footerClassName = '',
  showCheckboxes = false,
  onSelectionChange,
  loading = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  multiLevelHeaders,
  useMultiLevelHeaders = false,
  selectionText,
  enableSelectionHeader = true,
  emptyTable,
}: CustomTableProps<T>) => {
  const t = useCustomTranslation();
  // Handle selection change with useEffect to avoid render conflicts
  useEffect(() => {
    const selectedRows = rows.filter(row => selectedRowIds?.has(row.uuid));
    onSelectionChange?.(selectedRows);
  }, [selectedRowIds, rows, onSelectionChange]);

  // Memoize row IDs calculation
  const rowIds = useMemo(() => rows.map(row => row.uuid), [rows]);

  // Memoize all selected state
  const allSelected = useMemo(
    () => rowIds.length > 0 && rowIds.every(id => selectedRowIds?.has(id)),
    [selectedRowIds, rowIds]
  );

  // Check if any items are selected
  const hasSelection = useMemo(() => selectedRowIds && selectedRowIds.size > 0, [selectedRowIds]);

  // Count selected items
  const selectedCount = useMemo(() => selectedRowIds?.size || 0, [selectedRowIds]);

  // Memoize row selection handler
  const handleRowSelect = useCallback(
    (rowId: string, isSelected: boolean) => {
      const newSelected = new Set(selectedRowIds);
      if (isSelected) {
        newSelected.add(rowId);
      } else {
        newSelected.delete(rowId);
      }
      onSelectedRowIdsChange?.(newSelected);
    },
    [selectedRowIds, onSelectedRowIdsChange]
  );

  // Memoize select all handler
  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      const newSelected = isSelected ? new Set(rowIds) : new Set<string>();
      onSelectedRowIdsChange?.(newSelected);
    },
    [rowIds, onSelectedRowIdsChange]
  );

  // Clear selection handler
  const handleClearSelection = useCallback(() => {
    onSelectedRowIdsChange?.(new Set<string>());
  }, [onSelectedRowIdsChange]);

  // Memoize cell content renderer
  const renderCellContent = useCallback((value: unknown) => {
    if (React.isValidElement(value)) {
      return value;
    }
    if (value == null) {
      return '';
    }
    return String(value);
  }, []);

  // Memoize loading overlay
  const loadingOverlay = useMemo(
    () =>
      loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background h-full">
          <LoadingCustom className="h-6 w-6 z-20" />
        </div>
      ) : null,
    [loading]
  );

  // Memoize selection header (when items are selected)
  const selectionHeader = useMemo(() => {
    if (!hasSelection || !showCheckboxes) return null;

    const totalCols =
      useMultiLevelHeaders && multiLevelHeaders
        ? multiLevelHeaders[0]?.reduce((sum, header) => sum + (header.colspan || 1), 0) ||
          headers.length
        : headers.length;

    return (
      <TableHeader className={cn(headerClassName)}>
        <TableRow>
          <TableHead colSpan={totalCols + 1}>
            <div className="flex items-center w-full gap-5">
              <CustomButton
                onClick={handleClearSelection}
                className="flex items-center justify-center w-4 h-4 p-1 rounded-sm"
                aria-label="Clear selection"
                icon={'Minus'}
                iconClassName="text-background"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {selectionText
                  ? selectionText(selectedCount)
                  : selectedCount === 1
                    ? t('Element selected')
                    : t('Elements selected')}
              </span>
              <button
                onClick={() => handleSelectAll(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('Select All')}
              </button>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
    );
  }, [
    hasSelection,
    showCheckboxes,
    selectedCount,
    headers.length,
    useMultiLevelHeaders,
    multiLevelHeaders,
    headerClassName,
    handleClearSelection,
    handleSelectAll,
    t,
    selectionText,
  ]);

  // Memoize multi-level table headers
  const multiLevelTableHeaders = useMemo(() => {
    if (!useMultiLevelHeaders || !multiLevelHeaders) {
      return null;
    }

    return (
      <TableHeader className={headerClassName}>
        {multiLevelHeaders.map((headerRow, rowIndex) => (
          <TableRow key={rowIndex}>
            {showCheckboxes && rowIndex === 0 && (
              <TableHead className="w-12" rowSpan={multiLevelHeaders.length}>
                <CheckboxCustom
                  id="selectAll"
                  checked={allSelected}
                  onCheckedChange={checked => handleSelectAll(checked === true)}
                />
              </TableHead>
            )}
            {headerRow.map((header, colIndex) => (
              <TableHead
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'text-muted-foreground font-semibold text-sm',
                  header.colspan && header.colspan > 1 ? 'text-center' : '',
                  rowIndex === 0 ? 'bg-muted/50' : 'bg-muted/30'
                )}
                colSpan={header.colspan}
                rowSpan={header.rowspan}
              >
                {t(header.label)}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    );
  }, [
    useMultiLevelHeaders,
    multiLevelHeaders,
    headerClassName,
    showCheckboxes,
    allSelected,
    handleSelectAll,
    t,
  ]);

  // Memoize regular table headers
  const tableHeaders = useMemo(() => {
    // Show selection header if items are selected AND enableSelectionHeader is true
    if (hasSelection && showCheckboxes && enableSelectionHeader) {
      return selectionHeader;
    }

    // Show multi-level headers if enabled
    if (useMultiLevelHeaders) {
      return multiLevelTableHeaders;
    }

    // Show regular headers
    return (
      <TableHeader className={headerClassName}>
        <TableRow>
          {showCheckboxes && (
            <TableHead className="w-12">
              <CheckboxCustom
                id="selectAll"
                checked={allSelected}
                onCheckedChange={checked => handleSelectAll(checked === true)}
              />
            </TableHead>
          )}
          {headers.map(header => (
            <TableHead
              key={header.key}
              className={cn('text-muted-foreground font-semibold text-sm', header.className)}
            >
              {t(header.label)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  }, [
    hasSelection,
    showCheckboxes,
    enableSelectionHeader,
    selectionHeader,
    useMultiLevelHeaders,
    multiLevelTableHeaders,
    headerClassName,
    headers,
    allSelected,
    handleSelectAll,
    t,
  ]);

  // Memoize empty state
  const emptyState = useMemo(() => {
    const totalCols =
      useMultiLevelHeaders && multiLevelHeaders
        ? multiLevelHeaders[0]?.reduce((sum, header) => sum + (header.colspan || 1), 0) ||
          headers.length
        : headers.length;

    return (
      <TableRow>
        <TableCell colSpan={showCheckboxes ? totalCols + 1 : totalCols} className="h-64 p-0">
          <div className="flex h-full w-full items-center justify-center">
            {emptyTable?.message ? (
              <StatusCard
                srcImage={emptyTable.image || ''}
                message={emptyTable.message}
                description={emptyTable.description}
                messageClassName="mb-2"
                showBorder={false}
                positionIcon="left"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-sm text-muted-foreground">{t('No data available')}</p>
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }, [showCheckboxes, headers.length, useMultiLevelHeaders, multiLevelHeaders, t]);

  // Memoize table rows
  const tableRows = useMemo(() => {
    if (rows.length === 0 && !loading) {
      return emptyState;
    }
    return rows.map((row, index) => {
      const rowId = row.uuid;
      return (
        <TableRow
          key={`${rowId}-${index}`}
          className={cn(
            'text-sm font-normal text-foreground',
            selectedRowIds?.has(rowId) && '!bg-muted',
            rowClassName,
            !selectedRowIds?.has(rowId) && row.itemClassName
          )}
        >
          {showCheckboxes && (
            <TableCell className="w-12">
              <CheckboxCustom
                id={`row-${rowId}`}
                checked={selectedRowIds?.has(rowId)}
                onCheckedChange={checked => handleRowSelect(rowId, checked === true)}
              />
            </TableCell>
          )}
          {headers.map(header => (
            <TableCell key={header.key} className={header.className}>
              {renderCellContent(row[header.key as keyof T])}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  }, [
    rows,
    showCheckboxes,
    rowClassName,
    selectedRowIds,
    headers,
    handleRowSelect,
    renderCellContent,
    emptyState,
    loading,
  ]);

  // Memoize footer
  const tableFooter = useMemo(() => {
    if (!footer) return null;

    const totalCols =
      useMultiLevelHeaders && multiLevelHeaders
        ? multiLevelHeaders[0]?.reduce((sum, header) => sum + (header.colspan || 1), 0) ||
          headers.length
        : headers.length;

    return (
      <TableFooter>
        <TableRow className={cn('', footerClassName)}>
          {showCheckboxes && <TableCell />}
          <TableCell colSpan={totalCols - 1}>{t(footer.label)}</TableCell>
          <TableCell className="text-right">{t(footer.value)}</TableCell>
        </TableRow>
      </TableFooter>
    );
  }, [
    footer,
    footerClassName,
    showCheckboxes,
    headers.length,
    useMultiLevelHeaders,
    multiLevelHeaders,
    t,
  ]);

  return (
    <div className="relative">
      <div className={cn('relative', rows?.length <= 0 && loading ? 'min-h-[250px]' : 'h-auto')}>
        {loading && (
          <div className="absolute inset-0 z-10 bg-background/50 pointer-events-auto cursor-not-allowed" />
        )}
        {loadingOverlay}
        <Table className={cn('rounded-md', tableClassName)}>
          {caption && <TableCaption>{t(caption)}</TableCaption>}
          {tableHeaders}
          <TableBody>{tableRows}</TableBody>
          {tableFooter}
        </Table>
      </div>
    </div>
  );
};

export default React.memo(TableCustom) as typeof TableCustom;
