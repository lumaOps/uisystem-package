'use client';

import { useState } from 'react';
import { PaginationCustom } from './PaginationCustom';

export function PaginationWrapper() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <PaginationCustom
      currentPage={currentPage}
      lastPage={10}
      perPage={10}
      total={200}
      onPageChange={page => {
        console.log(page);
        setCurrentPage(page);
      }}
    />
  );
}
