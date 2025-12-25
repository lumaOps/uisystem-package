import { BreadCrumbCustomProps } from '@/types/common/breadcrumb/breadcrumb';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu/DropdownMenu';
import { Slash, ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

export function BreadCrumbCustom({
  items,
  separator,
  dropdownType,
  chevronTitle = '',
}: BreadCrumbCustomProps) {
  const t = useCustomTranslation();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{t(item.label)}</BreadcrumbPage>
              ) : item.href ? (
                <Link className={cn('font-normal text-foreground')} href={item.href}>
                  {t(item.label)}
                </Link>
              ) : item.dropdownItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {dropdownType === 'chevron' ? (
                      <>
                        {chevronTitle}
                        <ChevronDownIcon className="w-4 h-4" />
                      </>
                    ) : (
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.dropdownItems.map((dropdownItem, idx) => (
                      <DropdownMenuItem key={idx} asChild>
                        <Link
                          className="font-normal text-foreground cursor-pointer"
                          href={dropdownItem.href}
                        >
                          {t(dropdownItem.label)}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </BreadcrumbItem>
            {index < items.length - 1 &&
              (separator === 'slash' ? (
                <BreadcrumbSeparator className="px-2">
                  <Slash />
                </BreadcrumbSeparator>
              ) : (
                <BreadcrumbSeparator className="px-2" />
              ))}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
