import { ReactNode } from 'react';

export type AccordionItemType = {
  value: string;
  trigger: string;
  content: string | ReactNode;
};

export type AccordionCustomProps = {
  items: AccordionItemType[];
  containerClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export type AccordionFormPropsType = {
  formTitle: ReactNode;
  filledFields?: number;
  filledTotalFields?: number;
  formComponent?: React.ReactNode;
  containerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
  displayProgress?: boolean;
  displayBadgeStatus?: boolean;
  switchComponent?: React.ReactNode;
  sortable?: boolean;
  sortableId?: string;
  hideBody?: boolean;
};
