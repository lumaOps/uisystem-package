export interface SearchCustomProps {
  onSearchChange?: (searchValue: string) => void;
  defaultSearchValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // Search behavior props
  searchOnType?: boolean; // If true, search on every keystroke; if false, only on Enter
  // Dropdown mode props
  isDropdown?: boolean;
  options?: Array<{
    value: string;
    label: string;
    vehicle?: unknown;
    [key: string]: unknown;
  }>;
  onOptionSelect?: (option: {
    value: string;
    label: string;
    vehicle?: unknown;
    [key: string]: unknown;
  }) => void;
  selectedOptions?: Array<{
    value: string;
    label: string;
    vehicle?: unknown;
    [key: string]: unknown;
  }>;
  multiple?: boolean;
  renderOption?: (
    option: { value: string; label: string; vehicle?: unknown; [key: string]: unknown },
    isSelected: boolean
  ) => React.ReactNode;
  maxHeight?: string;
  isLoading?: boolean;
  // External ref for click outside handling
  externalRef?: React.RefObject<HTMLDivElement | null>;
  // Prevent dropdown from opening during submission
  isSubmitting?: boolean;
}
