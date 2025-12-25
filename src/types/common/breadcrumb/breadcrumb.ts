export type BreadCrumbLink = {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
  dropdownItems?: dropdownItemsType[];
};

export type dropdownItemsType = {
  label: string;
  href: string;
};
export type BreadCrumbCustomProps = {
  items: BreadCrumbLink[];
  separator: string;
  dropdownType?: 'chevron' | 'ellipsis';
  chevronTitle?: string;
};
