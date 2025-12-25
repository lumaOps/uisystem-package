import React from 'react';
import { CardCustom } from '../card/CardCustom';
import { SkeletonCustom } from './SkeletonCustom';

function SkeletonCardProfile() {
  return (
    <div className="grid gap-6 w-full">
      <CardCustom contentClassName="space-y-4" containerClassName="border-none shadow-none">
        <div className="grid grid-cols-4 gap-2 ">
          <div className="flex-1">
            <SkeletonCustom width="rounded-full" height="h-10 w-10" shape="circle" />
          </div>
          <div className="grid gap-2 col-span-3">
            <SkeletonCustom count={2} width="w-full" height="h-4" shape="circle" />
          </div>
        </div>
      </CardCustom>
    </div>
  );
}

export default SkeletonCardProfile;
