import React, { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/button/button';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/utils';

export type FbmpTag = {
  label: string;
  name: string;
  value: string;
};

interface TextareaWithTagsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  availableTags?: FbmpTag[];
  id?: string;
  errorMessage?: string;
  description?: string;
  label?: string;
  labelClassName?: string;
}

export const TextareaWithTags: React.FC<TextareaWithTagsProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
  availableTags = [],
  id,
  errorMessage,
  description,
  label,
  labelClassName,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef(value);
  const pendingCursorRef = useRef<number | null>(null);
  const isUpdatingRef = useRef(false);

  /** Group tags by name */
  const groupedTags = useCallback(() => {
    const groups: Record<string, FbmpTag[]> = {};
    availableTags.forEach(tag => {
      if (!groups[tag.name]) {
        groups[tag.name] = [];
      }
      groups[tag.name].push(tag);
    });
    return groups;
  }, [availableTags]);

  /** Compute linear caret position using only top-level child nodes */
  const getCursorPosition = useCallback((): number => {
    const container = editableRef.current;
    if (!container) return 0;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);

    let position = 0;
    for (let i = 0; i < container.childNodes.length; i++) {
      const child: ChildNode = container.childNodes[i] as ChildNode;

      if (child === range.endContainer) {
        // Cursor is inside a direct text node child
        position += range.endOffset;
        return position;
      }

      if (child.nodeType === Node.TEXT_NODE) {
        const len = child.textContent?.length || 0;
        position += len;
        continue;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (el.dataset && el.dataset.tagValue) {
          const tagLen = el.dataset.tagValue.length;
          // Selections cannot be inside a contentEditable=false chip; if range is before this chip
          if (range.endContainer === container && range.endOffset === i) {
            return position; // caret is right before this chip
          }
          position += tagLen;
          // If caret is positioned right after this chip (selection anchored on container at i+1)
          if (range.endContainer === container && range.endOffset === i + 1) {
            return position;
          }
          continue;
        }
        // Fallback: count text content of unknown elements
        position += el.textContent?.length || 0;
      }
    }

    return position;
  }, []);

  /** Set cursor position based on linear index across top-level child nodes */
  const setCursorPosition = useCallback((position: number) => {
    const container = editableRef.current;
    if (!container) return;
    const selection = window.getSelection();
    if (!selection) return;

    let currentPos = 0;
    let placed = false;
    const range = document.createRange();

    for (let i = 0; i < container.childNodes.length; i++) {
      const child: ChildNode = container.childNodes[i] as ChildNode;

      if (child.nodeType === Node.TEXT_NODE) {
        const len = child.textContent?.length || 0;
        if (position <= currentPos + len) {
          const offset = Math.max(0, Math.min(len, position - currentPos));
          try {
            range.setStart(child, offset);
            range.collapse(true);
          } catch (e) {
            console.error('Failed to set cursor:', e);
          }
          placed = true;
          break;
        }
        currentPos += len;
        continue;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (el.dataset && el.dataset.tagValue) {
          const tagLen = el.dataset.tagValue.length;
          if (position <= currentPos + tagLen) {
            try {
              range.setStartAfter(el);
              range.collapse(true);
            } catch (e) {
              console.error('Failed to set cursor:', e);
            }
            placed = true;
            break;
          }
          currentPos += tagLen;
          continue;
        }
        const textLen = el.textContent?.length || 0;
        if (position <= currentPos + textLen) {
          // Best-effort: place after element if within it
          try {
            range.setStartAfter(el);
            range.collapse(true);
          } catch (e) {
            console.error('Failed to set cursor:', e);
          }
          placed = true;
          break;
        }
        currentPos += textLen;
      }
    }

    if (!placed) {
      try {
        range.selectNodeContents(container);
        range.collapse(false);
      } catch (e) {
        console.error('Failed to set cursor:', e);
      }
    }

    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      console.error('Failed to set cursor:', e);
    }
  }, []);

  /** Extract text from DOM */
  const extractText = useCallback((node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.dataset.tagValue) {
        return el.dataset.tagValue;
      }
      return Array.from(node.childNodes).map(extractText).join('');
    }
    return '';
  }, []);

  /** Delete a tag by finding its position in the DOM */
  const deleteTagByValue = useCallback(
    (tagValue: string, chipElement: HTMLElement) => {
      if (isUpdatingRef.current) return;

      // Calculate position of this tag in the value string using top-level children
      let position = 0;
      const container = editableRef.current;
      if (!container) return;

      let tagPosition = -1;
      for (let i = 0; i < container.childNodes.length; i++) {
        const child = container.childNodes[i] as ChildNode;
        if (child === chipElement) {
          tagPosition = position;
          break;
        }
        if (child.nodeType === Node.TEXT_NODE) {
          position += child.textContent?.length || 0;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          if (el.dataset && el.dataset.tagValue) {
            position += el.dataset.tagValue.length;
          } else {
            position += el.textContent?.length || 0;
          }
        }
      }

      if (tagPosition !== -1) {
        const newValue = value.slice(0, tagPosition) + value.slice(tagPosition + tagValue.length);
        pendingCursorRef.current = tagPosition;
        onChange(newValue);
      }
    },
    [value, onChange]
  );

  /** Render content with tags */
  const renderContent = useCallback(() => {
    if (!editableRef.current || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    const container = editableRef.current;
    const savedCursor = pendingCursorRef.current ?? getCursorPosition();

    // Clear container
    container.innerHTML = '';

    if (!value) {
      isUpdatingRef.current = false;
      pendingCursorRef.current = null;
      return;
    }

    const fragment = document.createDocumentFragment();
    let remaining = value;

    while (remaining.length > 0) {
      let earliestIndex = remaining.length;
      let foundTag: FbmpTag | null = null;

      // Find earliest tag
      for (const tag of availableTags) {
        const idx = remaining.indexOf(tag.value);
        if (idx !== -1 && idx < earliestIndex) {
          earliestIndex = idx;
          foundTag = tag;
        }
      }

      if (foundTag) {
        // Add text before tag
        if (earliestIndex > 0) {
          fragment.appendChild(document.createTextNode(remaining.substring(0, earliestIndex)));
        }

        // Create tag chip
        const chip = document.createElement('span');
        chip.className =
          'inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm mx-0.5 cursor-default';
        chip.contentEditable = 'false';
        chip.dataset.tagValue = foundTag.value;
        chip.setAttribute('data-tag', 'true');

        const text = document.createElement('span');
        text.textContent = foundTag.label;
        chip.appendChild(text);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className =
          'flex-shrink-0 ml-0.5 rounded-full p-0.5 hover:bg-gray-300 transition-colors';
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        deleteButton.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          deleteTagByValue(foundTag!.value, chip);
        });

        chip.appendChild(deleteButton);
        fragment.appendChild(chip);

        remaining = remaining.substring(earliestIndex + foundTag.value.length);
      } else {
        fragment.appendChild(document.createTextNode(remaining));
        break;
      }
    }

    container.appendChild(fragment);

    // Restore cursor after a brief delay to ensure DOM is ready
    setTimeout(() => {
      setCursorPosition(savedCursor);
      pendingCursorRef.current = null;
      isUpdatingRef.current = false;
    }, 0);
  }, [value, availableTags, getCursorPosition, setCursorPosition, deleteTagByValue]);

  /** Handle input */
  const handleInput = useCallback(() => {
    if (!editableRef.current || isComposingRef.current || isUpdatingRef.current) return;

    const currentCursor = getCursorPosition();
    let text = '';

    editableRef.current.childNodes.forEach(node => {
      text += extractText(node);
    });

    if (text !== value) {
      pendingCursorRef.current = currentCursor;
      onChange(text);
    }
  }, [value, getCursorPosition, extractText, onChange]);

  /** Handle key events */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Enter for new lines
      if (e.key === 'Enter') {
        e.preventDefault();
        const cursorPosition = getCursorPosition();
        const newValue =
          value.substring(0, cursorPosition) + '\n' + value.substring(cursorPosition);
        pendingCursorRef.current = cursorPosition + 1;
        onChange(newValue);
        return;
      }

      // Handle Backspace and Delete for tags
      if (e.key !== 'Backspace' && e.key !== 'Delete') return;

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);

      // Special-case: if a single chip is selected (common when Backspace at end selects chip), delete it
      if (!range.collapsed && editableRef.current) {
        const container = editableRef.current;
        if (
          selection.anchorNode === container &&
          selection.focusNode === container &&
          typeof selection.anchorOffset === 'number' &&
          typeof selection.focusOffset === 'number'
        ) {
          const from = Math.min(selection.anchorOffset, selection.focusOffset);
          const to = Math.max(selection.anchorOffset, selection.focusOffset);
          // When exactly one child is selected
          if (to - from === 1) {
            const selectedNode = container.childNodes[from] as ChildNode | undefined;
            if (
              selectedNode &&
              selectedNode.nodeType === Node.ELEMENT_NODE &&
              (selectedNode as HTMLElement).dataset?.tagValue
            ) {
              e.preventDefault();
              const el = selectedNode as HTMLElement;
              const tagValue = el.dataset.tagValue as string;

              // Compute position of this chip in linear text
              let pos = 0;
              for (let i = 0; i < from; i++) {
                const n = container.childNodes[i];
                if (n.nodeType === Node.TEXT_NODE) {
                  pos += n.textContent?.length || 0;
                } else if ((n as HTMLElement).dataset?.tagValue) {
                  pos += (n as HTMLElement).dataset.tagValue!.length;
                }
              }

              const newValue = value.slice(0, pos) + value.slice(pos + tagValue.length);
              pendingCursorRef.current = pos;
              onChange(newValue);
              return;
            }
          }
        }
        // For other non-collapsed selections, let default behavior delete selection
        return;
      }

      const cursorPosition = getCursorPosition();

      // Check if we're next to a tag
      let tagToDelete: { value: string; position: number } | null = null;
      const searchPos = 0;

      for (const tag of availableTags) {
        let idx = value.indexOf(tag.value, searchPos);
        while (idx !== -1) {
          if (e.key === 'Backspace' && idx + tag.value.length === cursorPosition) {
            tagToDelete = { value: tag.value, position: idx };
            break;
          } else if (e.key === 'Delete' && idx === cursorPosition) {
            tagToDelete = { value: tag.value, position: idx };
            break;
          }
          idx = value.indexOf(tag.value, idx + 1);
        }
        if (tagToDelete) break;
      }

      if (tagToDelete) {
        e.preventDefault();
        const newValue =
          value.slice(0, tagToDelete.position) +
          value.slice(tagToDelete.position + tagToDelete.value.length);
        pendingCursorRef.current = tagToDelete.position;
        onChange(newValue);
      }
    },
    [value, onChange, getCursorPosition, availableTags]
  );

  /** Handle paste */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      const cursorPosition = getCursorPosition();
      const newValue = value.substring(0, cursorPosition) + text + value.substring(cursorPosition);
      pendingCursorRef.current = cursorPosition + text.length;
      onChange(newValue);
    },
    [value, onChange, getCursorPosition]
  );

  /** Insert variable at cursor */
  const insertVariable = useCallback(
    (variableValue: string) => {
      const editable = editableRef.current;
      if (!editable) return;

      editable.focus();
      const cursorPosition = getCursorPosition();
      const newValue =
        value.substring(0, cursorPosition) + variableValue + value.substring(cursorPosition);
      pendingCursorRef.current = cursorPosition + variableValue.length;
      onChange(newValue);
    },
    [value, onChange, getCursorPosition]
  );

  /** Handle IME composition */
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    handleInput();
  }, [handleInput]);

  /** Sync value changes */
  useEffect(() => {
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;
      renderContent();
    }
  }, [value, renderContent]);

  /** Initialize */
  useEffect(
    () => {
      renderContent();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const grouped = groupedTags();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(grouped).map(([name, tags]) => (
          <div key={name} className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Button
                key={tag.value}
                onClick={() => insertVariable(tag.value)}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Plus size={14} />
                <span>{tag.label}</span>
              </Button>
            ))}
          </div>
        ))}
      </div>

      {label && (
        <label
          htmlFor={id}
          className={cn('block text-sm font-medium text-primary', labelClassName)}
        >
          {label}
        </label>
      )}

      <div
        ref={editableRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-7 transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/50 shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        data-placeholder={placeholder}
        id={id}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {description && !errorMessage && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {errorMessage && <p className="text-xs font-medium text-destructive">{errorMessage}</p>}
    </div>
  );
};
