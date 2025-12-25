'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { InputCustom } from '@/components/input/InputCustom';
import ColorPicker from '@/components/color-picker/ColorPicker';

interface ColorInputProps {
  label: string;
  color: string;
  placeholder: string;
  id: string;
  onColorChange: (color: string) => void;
  openColorPicker?: string | null;
  setOpenColorPicker?: (type: string | null) => void;
}

const ColorInput = ({ label, color, placeholder, id, onColorChange }: ColorInputProps) => {
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLDivElement>(null);

  const handleColorClick = () => {
    if (openColorPicker === id) {
      setOpenColorPicker(null);
    } else {
      // Calculate position when opening
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setPickerPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      }
      setOpenColorPicker(id);
    }
  };

  // Close picker when clicking outside
  useEffect(() => {
    if (openColorPicker !== id) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        const pickerElement = document.querySelector(`[data-color-picker="${id}"]`);
        if (pickerElement && !pickerElement.contains(event.target as Node)) {
          setOpenColorPicker(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openColorPicker, id]);

  const onColorSelect = (color: string) => {
    onColorChange(color);
  };

  const isWhite =
    color.toLowerCase() === '#ffffff' ||
    color.toLowerCase() === '#fff' ||
    color.toLowerCase() === 'white';
  const borderClass = isWhite ? 'border-2 border-muted' : 'border border-background';

  return (
    <div>
      <label className="text-xs text-muted-foreground mb-2 block">{label}</label>
      <div
        ref={inputRef}
        className="relative rounded-md border border-input bg-background shadow-sm hover:shadow-base
          focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-primary"
      >
        <div
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform ${borderClass}`}
          style={{ backgroundColor: color }}
          onClick={handleColorClick}
        ></div>
        <InputCustom
          value={color}
          onChange={e => onColorChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 w-full h-full border-0 bg-transparent py-0 text-sm shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          containerClassName="hover:shadow-none focus-within:ring-0 focus-within:border-0 text-xs pl-10 !border-none w-full focus-within:ring-offset-0 bg-transparent"
          id={id}
        />
      </div>
      {openColorPicker === id &&
        createPortal(
          <div
            data-color-picker={id}
            className="fixed z-[9999] w-[320px]"
            style={{
              top: `${pickerPosition.top}px`,
              left: `${pickerPosition.left}px`,
            }}
          >
            <ColorPicker
              default_value={color}
              onChange={onColorSelect}
              onClose={() => setOpenColorPicker(null)}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default ColorInput;
