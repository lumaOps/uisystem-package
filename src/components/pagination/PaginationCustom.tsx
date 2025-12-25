'use client';

import { DataPaginationProps } from '@/types/common/pagination/paginationCustom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

export function PaginationCustom({
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  hidePages = false,
  hidePrevious = false,
  hideNext = false,
}: DataPaginationProps) {
  // Ensure perPage is at least 1 to avoid division by zero
  const safePerPage = Math.max(perPage, 1);

  // Calculate the actual last page based on total items and perPage
  const calculatedLastPage = Math.ceil(total / safePerPage);

  // Choose the maximum between calculatedLastPage and lastPage, ensure at least 1
  const actualLastPage = Math.max(calculatedLastPage, lastPage, 1);

  // Determine which page numbers should be visible
  const getVisiblePages = (): number[] => {
    if (actualLastPage <= 4) {
      return Array.from({ length: actualLastPage }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4];
    }
    if (currentPage >= actualLastPage - 2) {
      return [actualLastPage - 3, actualLastPage - 2, actualLastPage - 1, actualLastPage];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getVisiblePages();

  // Handle page link clicks safely
  const handlePageClick = (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (page !== currentPage && page >= 1 && page <= actualLastPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        {!hidePrevious && (
          <PaginationItem>
            <PaginationPrevious
              role="button"
              aria-disabled={currentPage === 1}
              disabled={currentPage === 1}
              onClick={handlePageClick(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {/* Display first page and ellipsis if needed */}
        {!hidePages && currentPage > 3 && actualLastPage > 6 && (
          <>
            <PaginationItem>
              <PaginationLink role="button" onClick={handlePageClick(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Display dynamic page numbers */}
        {!hidePages &&
          pages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                role="button"
                isActive={page === currentPage}
                onClick={handlePageClick(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Display last page and ellipsis if needed */}
        {!hidePages && currentPage < actualLastPage - 2 && actualLastPage > 6 && (
          <>
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink role="button" onClick={handlePageClick(actualLastPage)}>
                {actualLastPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        {!hideNext && (
          <PaginationItem>
            <PaginationNext
              role="button"
              aria-disabled={currentPage === actualLastPage}
              disabled={currentPage === actualLastPage}
              onClick={handlePageClick(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
