import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion/accordion';
import { cn } from '@/utils/utils';
import { AccordionCustomProps, AccordionItemType } from '@/types/common/accordion/accordion';

export function AccordionCustom({
  items,
  containerClassName = '',
  itemClassName = '',
  triggerClassName = '',
  contentClassName = '',
}: AccordionCustomProps) {
  return (
    <Accordion type="single" collapsible className={cn('w-full min-w-[360px]', containerClassName)}>
      {items.map((item: AccordionItemType) => (
        <AccordionItem key={item.value} value={item.value} className={itemClassName}>
          <AccordionTrigger className={triggerClassName}>{item.trigger}</AccordionTrigger>
          <AccordionContent className={contentClassName}>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
