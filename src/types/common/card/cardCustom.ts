import React from 'react';

export interface CardCustomType {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}
