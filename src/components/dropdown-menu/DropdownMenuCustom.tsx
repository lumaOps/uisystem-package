'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/dropdown-menu/DropdownMenu';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import {
  DropdownCustomProps,
  ItemType,
  MenuItem,
  MenuSection,
  SubMenuItem,
} from '@/types/common/dropdown-menu/dropdownMenu';
import { CustomButton } from '../button/CustomButton';
import { InputCustom } from '../input/InputCustom';
import { cn } from '@/utils/utils';
import { Separator } from '@/components/separator/separator';

// Étendre l'interface pour inclure les props de recherche
interface DropdownCustomPropsWithSearch extends DropdownCustomProps {
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
  searchInputClassName?: string;
}

const DropdownMenuCustom = ({
  list_menu,
  buttonText = 'Menu',
  menuWidth = 'w-56',
  buttonVariant = 'default',
  buttonClassName = '',
  disabled = false,
  hasSections = false,
  itemType = 'default',
  align = 'end',
  onSelectionChange,
  allowMultiple = false,
  side = 'bottom',
  buttonIcon = <ChevronDown className="ml-2 h-4 w-4" />,
  customTrigger,
  triggerType = 'click',
  searchable = false,
  searchPlaceholder = 'Search...',
  noResultsText = 'No data found',
  customHeader,
  searchInputClassName = '',
}: DropdownCustomPropsWithSearch) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const maintainFocusRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filterItems = useCallback((items: MenuItem[], search: string): MenuItem[] => {
    if (!search.trim()) return items;

    const searchLower = search.toLowerCase();
    return items.filter(item => {
      // Filtrer par label principal
      const mainMatch = item.label.toLowerCase().includes(searchLower);

      // Filtrer par submenu si présent
      const submenuMatch = item.submenu?.some(subItem =>
        subItem.label.toLowerCase().includes(searchLower)
      );

      return mainMatch || submenuMatch;
    });
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return list_menu;
    }

    if (hasSections) {
      return (list_menu as MenuSection[])
        .map(section => ({
          ...section,
          items: filterItems(section.items, searchTerm),
        }))
        .filter(section => section.items.length > 0);
    } else {
      return filterItems(list_menu as MenuItem[], searchTerm);
    }
  }, [list_menu, searchTerm, searchable, hasSections, filterItems]);

  const hasResults = useMemo(() => {
    if (hasSections) {
      return (filteredMenuItems as MenuSection[]).some(section => section.items.length > 0);
    } else {
      return (filteredMenuItems as MenuItem[]).length > 0;
    }
  }, [filteredMenuItems, hasSections]);

  // Handle opening the dropdown
  const handleOpen = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  // Handle closing attempt with delay
  const handleCloseAttempt = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  const handleEnterKeySelection = () => {
    let selectedItem: MenuItem | SubMenuItem | undefined;

    if (hasSections) {
      const allItems = (filteredMenuItems as MenuSection[]).flatMap(section => section.items);
      if (allItems.length === 1) {
        selectedItem = allItems[0];
      }
    } else {
      const items = filteredMenuItems as MenuItem[];
      if (items.length === 1) {
        selectedItem = items[0];
      }
    }

    if (selectedItem) {
      handleItemSelect(selectedItem.value, selectedItem.onClick);
      setIsOpen(false);
    }
  };
  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (maintainFocusRef.current && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filteredMenuItems]);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      setCanScrollDown(false);
      setCanScrollUp(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Wait for next tick to ensure DOM is rendered
      //with a delay, because it might run before the scrollable container exists in the DOM
      const timeoutId = setTimeout(() => {
        checkScroll();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, filteredMenuItems, checkScroll]);

  useEffect(() => {
    if (!isOpen) return;
    //If you check scrollContainerRef.current immediately, it might still be null
    const timeout = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleScroll = () => checkScroll();
      //every time the user scrolls, checkScroll will update the UI
      container.addEventListener('scroll', handleScroll);

      return () => container.removeEventListener('scroll', handleScroll);
    }, 0);

    return () => clearTimeout(timeout);
  }, [checkScroll, isOpen]);

  // Handle checkbox selection
  const handleCheckboxChange = (value: string, sectionIndex?: number) => {
    setSelectedValues(prev => {
      let newValues;
      if (prev.includes(value)) {
        newValues = prev.filter(v => v !== value);
      } else {
        newValues = allowMultiple ? [...prev, value] : [value];
      }

      if (onSelectionChange) {
        onSelectionChange(allowMultiple ? newValues : value, sectionIndex);
      }

      return newValues;
    });
  };

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);
  // Handle default item selection
  const handleItemSelect = (value: string, onClick?: () => void, sectionIndex?: number) => {
    if (onClick) onClick();
    if (onSelectionChange) onSelectionChange(value, sectionIndex);
  };

  // Render submenu items
  const renderSubmenuItems = (items: SubMenuItem[], sectionIndex?: number) => {
    return items.map((item, idx) => (
      <DropdownMenuItem
        key={`submenu-item-${idx}-${item.value}`}
        className={item.itemClassName}
        onClick={() => {
          if (item.onClick) item.onClick();
          if (onSelectionChange) onSelectionChange(item.value, sectionIndex);
        }}
        disabled={item.disabled}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        <span>{item.label}</span>
        {item.shortcut && (
          <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
        )}
      </DropdownMenuItem>
    ));
  };
  // Render menu items based on type
  const renderMenuItems = (
    items: MenuItem[],
    type: ItemType = 'default',
    sectionIndex?: number
  ) => {
    return items.map((item, idx) => {
      // Handle submenu items
      if (item.submenu && item.submenu.length > 0) {
        return (
          <DropdownMenuSub key={`menu-sub-${idx}-${item.value}`}>
            <DropdownMenuSubTrigger disabled={item.disabled}>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={`${menuWidth} max-h-48 overflow-y-auto`}
                style={{
                  scrollbarWidth: 'none',
                }}
              >
                {renderSubmenuItems(item.submenu, sectionIndex)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      // Handle checkbox items
      if (type === 'checkbox') {
        return (
          <DropdownMenuCheckboxItem
            key={`menu-checkbox-${idx}-${item.value}`}
            checked={selectedValues.includes(item.value) || item.checked}
            onCheckedChange={() => handleCheckboxChange(item.value, sectionIndex)}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
            )}
          </DropdownMenuCheckboxItem>
        );
      }

      // Handle radio items
      if (type === 'radio') {
        return (
          <DropdownMenuRadioItem
            key={`menu-radio-${idx}-${item.value}`}
            value={item.value}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
            )}
          </DropdownMenuRadioItem>
        );
      }

      // Default menu items
      return (
        <DropdownMenuItem
          key={`menu-item-${idx}-${item.value}`}
          onClick={() => handleItemSelect(item.value, item.onClick, sectionIndex)}
          disabled={item.disabled}
          className={cn('cursor-pointer', item.itemClassName)}
        >
          {item.icon && <span className={cn('mr-2', item.iconClassName)}>{item.icon}</span>}
          <span>{item.label}</span>
          {item.shortcut && (
            <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
          )}
        </DropdownMenuItem>
      );
    });
  };

  // Render sections - optimisé
  const renderSections = () => {
    if (!hasSections) {
      const items = filteredMenuItems as MenuItem[];
      return items.length > 0 ? renderMenuItems(items, itemType) : null;
    }

    return (filteredMenuItems as MenuSection[]).map((section, idx) => (
      <React.Fragment key={`section-${idx}`}>
        {idx > 0 && <DropdownMenuSeparator />}
        {section.title && <DropdownMenuLabel>{section.title}</DropdownMenuLabel>}
        {section.type === 'radio' ? (
          <DropdownMenuRadioGroup
            value={selectedValues[0] || ''}
            onValueChange={value => {
              setSelectedValues([value]);
              if (onSelectionChange) onSelectionChange(value, idx);
            }}
          >
            {renderMenuItems(section.items, section.type || itemType, idx)}
          </DropdownMenuRadioGroup>
        ) : (
          renderMenuItems(section.items, section.type || itemType, idx)
        )}
      </React.Fragment>
    ));
  };

  // Create default trigger element
  const defaultTrigger = (
    <CustomButton
      variant={buttonVariant}
      className={`flex items-center ${buttonClassName}`}
      disabled={disabled}
    >
      {buttonText}
      {buttonIcon}
    </CustomButton>
  );

  // Use either custom trigger or default trigger
  const triggerElement = customTrigger || defaultTrigger;

  const SearchInput = useCallback(
    () => (
      <div className="relative p-2 border-b">
        <InputCustom
          id="dropdown-search"
          ref={searchInputRef}
          type="text"
          placeholder={searchPlaceholder}
          startIcon={<Search className="h-4 w-4" />}
          endIcon={
            searchTerm && (
              <X
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground"
                onClick={() => setSearchTerm('')}
              />
            )
          }
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            maintainFocusRef.current = true;
          }}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              handleEnterKeySelection();
            }
          }}
          className={`w-full ${searchInputClassName}`}
          containerClassName="h-8"
          inputClassName="text-sm"
        />
      </div>
    ),

    //eslint-disable-next-line react-hooks/exhaustive-deps
    [searchTerm, searchPlaceholder, searchInputClassName]
  );

  const NoResults = () => (
    <div className="p-4 text-center text-sm text-muted-foreground">{noResultsText}</div>
  );
  const handleChevronScroll = (direction: 'up' | 'down') => {
    //scrollContainerRef is a ref pointing to the scrollable menu container.
    const container = scrollContainerRef.current;
    //If it doesn’t exist (not yet rendered), just exit.
    if (!container) return;

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    //Defines the number of pixels to move the scroll each step of the interval
    const step = 3;
    //setInterval creates a repeating task every 16ms for the scroll.
    scrollIntervalRef.current = setInterval(() => {
      //scrollTop : How far the container is scrolled from the top in pixels.
      //scrollHeight : Total height of the content inside the container (including the part hidden by scrolling).
      //clientHeight : Height of the visible part of the container.
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (direction === 'down') {
        if (scrollTop + clientHeight >= scrollHeight) {
          // but we are already at the bottom?
          //If yes, we stop the scrolling interval using clearInterval, because there’s nothing more to scroll down.
          clearInterval(scrollIntervalRef.current!);
          return;
        }
        container.scrollTop += step;
      } else {
        if (scrollTop <= 0) {
          //Check if scrollTop <= 0. If yes, we’re at the top, so stop scrolling.
          clearInterval(scrollIntervalRef.current!);
          return;
        }
        container.scrollTop -= step;
      }

      checkScroll();
    }, 16);
    //16ms : gives smooth animation.
  };

  if (triggerType === 'hover') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <div
          onMouseEnter={handleOpen}
          onMouseLeave={handleCloseAttempt}
          className="inline-block w-auto"
        >
          <DropdownMenuTrigger asChild data-state={isOpen ? 'open' : 'closed'}>
            {triggerElement}
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent
          className={menuWidth}
          onMouseEnter={handleOpen}
          onMouseLeave={handleCloseAttempt}
          onCloseAutoFocus={e => e.preventDefault()}
          align={align}
          side={side}
          data-state={isOpen ? 'open' : 'closed'}
        >
          {searchable && <SearchInput />}
          {customHeader && (
            <>
              <div className="p-2">{customHeader}</div>
              <Separator className="-mx-1 my-1 h-px bg-muted" />
            </>
          )}
          <div className="relative">
            {canScrollUp && (
              <div
                className="absolute top-0 left-0 w-full flex justify-center bg-gradient-to-b from-background to-transparent cursor-pointer z-10 h-8 items-center"
                onMouseEnter={() => handleChevronScroll('up')}
                onMouseLeave={stopScrolling}
              >
                <ChevronUp className="h-6 w-6 text-muted-foreground -mt-[2px]" />
              </div>
            )}

            <div
              ref={scrollContainerRef}
              className="max-h-48 overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div>{hasResults ? renderSections() : searchable && searchTerm && <NoResults />}</div>
            </div>

            {canScrollDown && (
              <div
                className="bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-background to-transparent cursor-pointer z-10 h-8 items-center"
                onMouseEnter={() => handleChevronScroll('down')}
                onMouseLeave={stopScrolling}
              >
                <ChevronDown className="h-6 w-6 text-muted-foreground mt-[2px]" />
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {triggerElement}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={menuWidth} align={align} side={side}>
        {searchable && <SearchInput />}
        {customHeader && (
          <>
            <div className="p-2">{customHeader}</div>
            <Separator className="-mx-1 my-1 h-px bg-muted" />
          </>
        )}
        <div className="relative">
          {canScrollUp && (
            <div
              className="absolute top-0 left-0 w-full flex justify-center items-center 
                        bg-background cursor-pointer z-10 h-5"
              onMouseEnter={() => handleChevronScroll('up')}
              onMouseLeave={stopScrolling}
            >
              <ChevronUp className="h-4 w-4 leading-none -mt-[2px]" />
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="max-h-48 overflow-y-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div>{hasResults ? renderSections() : searchable && searchTerm && <NoResults />}</div>
          </div>

          {canScrollDown && (
            <div
              className="bottom-0 absolute left-0 w-full flex justify-center bg-background cursor-pointer z-10 h-5 items-center"
              onMouseEnter={() => handleChevronScroll('down')}
              onMouseLeave={stopScrolling}
            >
              <ChevronDown className="h-4 w-4 leading-none mt-[2px]" />
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuCustom;
