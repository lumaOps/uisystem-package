export interface DataPaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  hidePages?: boolean;
  hidePrevious?: boolean;
  hideNext?: boolean;

  onPageChange: (page: number) => void;
}
