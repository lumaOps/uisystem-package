'use client';
import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/accordion/accordion';
import { BadgeStatusCustom } from '@/components/badge/BadgeStatusCustom';
import ProgressCyrcle from '../progress/ProgressCyrcle';
import { cn } from '@/utils/utils';
import { AccordionFormPropsType } from '@/types/common/accordion/accordion';
import { GripVertical } from 'lucide-react';

function AccordionForm({
  formTitle,
  filledFields,
  filledTotalFields,
  formComponent,
  containerClassName,
  triggerClassName,
  contentClassName,
  defaultOpen = true,
  displayProgress = true,
  displayBadgeStatus = true,
  switchComponent,
  sortable = false,
  sortableId,
  hideBody = false,
}: AccordionFormPropsType) {
  const [isOpen, setIsOpen] = useState(defaultOpen); // State to track accordion open/close

  const accordionContent = hideBody ? (
    // Simple header without accordion functionality
    <div className={cn('w-full border rounded-lg', containerClassName)}>
      <div
        className={cn(
          'text-foreground p-2 text-sm relative rounded-lg',
          filledFields && filledFields > 0 ? 'bg-muted' : 'bg-background',
          triggerClassName
        )}
      >
        <div className="m-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {displayProgress && (
                <ProgressCyrcle
                  percentage={
                    filledFields && filledFields > 0
                      ? ((filledFields ?? 0) / (filledTotalFields ?? 1)) * 100
                      : 0
                  }
                />
              )}

              <div className="flex-1 flex items-center gap-3">
                {sortable && <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />}
                {switchComponent}
                {formTitle}
              </div>
            </div>
            {displayBadgeStatus && (
              <div className="flex-1 absolute right-12 top-6">
                <BadgeStatusCustom
                  variant={filledFields && filledFields > 0 ? 'blue' : 'gray'}
                  withBullet={false}
                >
                  {filledFields} / {filledTotalFields}
                </BadgeStatusCustom>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    // Full accordion with toggle functionality
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? 'form-fields' : ''}
      className={cn('w-full border rounded-lg', containerClassName)}
      onValueChange={value => setIsOpen(value === 'form-fields')} // Update state on toggle
    >
      <AccordionItem value="form-fields">
        <AccordionTrigger
          className={cn(
            'text-foreground p-2 text-sm relative rounded-t-lg hover:no-underline',
            filledFields && filledFields > 0 ? 'bg-muted' : 'bg-background',
            !isOpen && 'rounded-b-lg',
            triggerClassName
          )}
          classNameIcon="btn-outline p-1.5 flex text-center justify-center rounded-md "
        >
          <div className="m-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {displayProgress && (
                  <ProgressCyrcle
                    percentage={
                      filledFields && filledFields > 0
                        ? ((filledFields ?? 0) / (filledTotalFields ?? 1)) * 100
                        : 0
                    }
                  />
                )}

                <div className="flex-1 flex items-center gap-3">
                  {sortable && (
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  )}
                  {switchComponent}
                  <span>{formTitle}</span>
                </div>
              </div>
              {displayBadgeStatus && (
                <div className="flex-1 absolute right-12 top-6">
                  <BadgeStatusCustom
                    variant={filledFields && filledFields > 0 ? 'blue' : 'gray'}
                    withBullet={false}
                  >
                    {filledFields} / {filledTotalFields}
                  </BadgeStatusCustom>
                </div>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <div
          className={cn(
            'p-6 bg-background border-t rounded-b-lg transition-all duration-300',
            !isOpen ? 'hidden' : 'block', // Use CSS to toggle visibility
            contentClassName
          )}
        >
          {formComponent}
        </div>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className={cn(containerClassName)} {...(sortable && sortableId ? { id: sortableId } : {})}>
      {accordionContent}
    </div>
  );
}

export default AccordionForm;
