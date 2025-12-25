'use client';
import React, { useEffect, useState } from 'react';
import { BreadCrumbCustom } from './BreadCrumbCustom';

import { usePathname } from 'next/navigation';

import { generateBreadcrumbItemsFromPath } from '@/utils/helpers/helperFunctions';

// import { useBreadCrumbStore } from '@/stores/bread-crumb/useBreadCrumbStore';

function DynamicBreadCrumb() {
  const pathname = usePathname();
  // const breadCrumbStore = useBreadCrumbStore(state => state);

  const [breadcrumbItems, setBreadcrumbItems] = useState(
    generateBreadcrumbItemsFromPath(
      pathname || ''
      // , breadCrumbStore.getBreadCrumb
    )
  );

  useEffect(() => {
    setBreadcrumbItems(
      generateBreadcrumbItemsFromPath(
        pathname || ''
        // , breadCrumbStore.getBreadCrumb
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // breadCrumbStore.breadCrumb,

    pathname,
  ]);

  return (
    <div>
      <BreadCrumbCustom items={breadcrumbItems} separator="default" dropdownType="ellipsis" />
    </div>
  );
}

export default DynamicBreadCrumb;
