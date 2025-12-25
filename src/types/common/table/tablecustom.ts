interface Header {
  key: string;
  label: string;
  className?: string;
}

interface MultiLevelHeader {
  key: string;
  label: string;
  colspan?: number;
  rowspan?: number;
}

interface Footer {
  label: string;
  value: string;
}

export interface EmptyTableConfig {
  image?: string;
  message?: string;
  description?: string;
}
export interface CustomTableProps<T> {
  caption?: string;
  headers: Header[];
  rows: T[];
  footer?: Footer;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  footerClassName?: string;
  showCheckboxes?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  loading?: boolean;
  selectedRowIds?: Set<string>;
  onSelectedRowIdsChange?: (rowIds: Set<string>) => void;
  // New props for multi-level headers
  multiLevelHeaders?: MultiLevelHeader[][];
  useMultiLevelHeaders?: boolean;
  selectionText?: (count: number) => string;
  enableSelectionHeader?: boolean;
  emptyTable?: EmptyTableConfig;
}

export interface DataType {
  id: number;
  uuid: string;
  invoice: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
}
export const invoices: DataType[] = [
  {
    id: 1,
    uuid: '12',
    invoice: 'INV001',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    totalAmount: '$500',
  },
  {
    id: 2,
    uuid: '13',
    invoice: 'INV002',
    paymentStatus: 'Pending',
    paymentMethod: 'PayPal',
    totalAmount: '$1000',
  },
];

export const headers = [
  { key: 'invoice', label: 'Invoice' },
  { key: 'paymentStatus', label: 'Status' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'totalAmount', label: 'Amount' },
];
