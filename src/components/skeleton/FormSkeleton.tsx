import React from 'react';
import { SkeletonCustom } from './SkeletonCustom';
import { CardCustom } from '@/components/card/CardCustom';

export function FormSkeleton() {
  return (
    <div className="grid gap-6 w-full">
      <CardCustom
        header={<SkeletonCustom width="w-1/3" height="h-5" />}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <SkeletonCustom count={2} width="w-24" height="h-10" shape="circle" />
          </div>
        }
        contentClassName="space-y-4"
        containerClassName="border-none shadow-none"
      >
        <div className="grid gap-2">
          <SkeletonCustom count={2} width="w-full" height="h-10" shape="circle" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCustom count={2} width="w-full" height="h-10" shape="circle" />
        </div>
      </CardCustom>
    </div>
  );
}
