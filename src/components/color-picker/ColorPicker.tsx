'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/utils';

type hsl = {
  h: number;
  s: number;
  l: number;
};

type hex = {
  hex: string;
};
type Color = hsl & hex;

const HashtagIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

function hslToHex({ h, s, l }: hsl) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
  let r = Math.round(255 * f(0));
  let g = Math.round(255 * f(8));
  let b = Math.round(255 * f(4));

  // Clamp values to valid range
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsl({ hex }: hex): hsl {
  // Ensure the hex string is formatted properly
  hex = hex.replace(/^#/, '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }

  // Pad with zeros if incomplete
  while (hex.length < 6) {
    hex += '0';
  }

  // Convert hex to RGB
  let r = parseInt(hex.slice(0, 2), 16) || 0;
  let g = parseInt(hex.slice(2, 4), 16) || 0;
  let b = parseInt(hex.slice(4, 6), 16) || 0;

  // Then convert RGB to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
    h *= 360;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const DraggableColorCanvas = ({
  h,
  s,
  l,
  handleChange,
}: hsl & {
  handleChange: (e: Partial<Color>) => void;
}) => {
  const [dragging, setDragging] = useState(false);
  const colorAreaRef = useRef<HTMLDivElement>(null);

  const calculateSaturationAndLightness = useCallback(
    (clientX: number, clientY: number) => {
      if (!colorAreaRef.current) return;
      const rect = colorAreaRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const xClamped = Math.max(0, Math.min(x, rect.width));
      const yClamped = Math.max(0, Math.min(y, rect.height));
      const newSaturation = Math.round((xClamped / rect.width) * 100);
      const newLightness = 100 - Math.round((yClamped / rect.height) * 100);
      handleChange({ s: newSaturation, l: newLightness });
    },
    [handleChange]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      calculateSaturationAndLightness(e.clientX, e.clientY);
    },
    [calculateSaturationAndLightness]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    calculateSaturationAndLightness(e.clientX, e.clientY);
  };

  // Touch event handlers
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        calculateSaturationAndLightness(touch.clientX, touch.clientY);
      }
    },
    [calculateSaturationAndLightness]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      setDragging(true);
      calculateSaturationAndLightness(touch.clientX, touch.clientY);
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={colorAreaRef}
      className="h-48 w-full touch-auto overscroll-none rounded-xl border border-border"
      style={{
        background: `linear-gradient(to top, #000, transparent, #fff), linear-gradient(to left, hsl(${h}, 100%, 50%), #bbb)`,
        position: 'relative',
        cursor: 'crosshair',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="color-selector border-4 border-background ring-1 ring-border"
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: `hsl(${h}, ${s}%, ${l}%)`,
          transform: 'translate(-50%, -50%)',
          left: `${s}%`,
          top: `${100 - l}%`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      ></div>
    </div>
  );
};

function sanitizeHex(val: string) {
  const sanitized = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return sanitized;
}

interface ColorPickerProps {
  default_value?: string;
  onChange?: (color: string) => void;
  onClose?: () => void;
}

const ColorPicker = ({ default_value = '#1C9488', onChange, onClose }: ColorPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const onChangeRef = useRef(onChange);
  const lastHexRef = useRef<string>('');

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Initialize from controlled prop or a default
  const [color, setColor] = useState<Color>(() => {
    const hex = sanitizeHex(default_value);
    const hsl = hexToHsl({ hex: hex });
    const hexValue = sanitizeHex(hex);
    lastHexRef.current = `#${hexValue}`;
    return { ...hsl, hex: hexValue };
  });

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Update from hex input
  const handleHexInputChange = useCallback((newVal: string) => {
    const hex = sanitizeHex(newVal);
    if (hex.length === 6) {
      try {
        const hsl = hexToHsl({ hex });
        const newColor = { ...hsl, hex: hex };
        setColor(newColor);
        // onChange will be called by useEffect
      } catch (error) {
        console.error('Error converting Hex to HSL:', error);
      }
    } else if (hex.length < 6) {
      setColor(prev => ({ ...prev, hex: hex }));
    }
  }, []);

  const handleColorChange = useCallback((partial: Partial<Color>) => {
    setColor(prev => {
      const value = { ...prev, ...partial };
      try {
        const hex_formatted = hslToHex({
          h: value.h,
          s: value.s,
          l: value.l,
        });
        const newColor = { ...value, hex: hex_formatted };
        return newColor;
      } catch (error) {
        console.error('Error converting HSL to Hex:', error);
        return prev;
      }
    });
  }, []);

  // Use useEffect to call onChange after state update to prevent render-time updates
  useEffect(() => {
    if (isInitialized) {
      const hex_formatted = hslToHex({
        h: color.h,
        s: color.s,
        l: color.l,
      });
      const newHex = `#${hex_formatted}`;

      // Only call onChange if the hex actually changed
      if (newHex !== lastHexRef.current) {
        lastHexRef.current = newHex;
        onChangeRef.current?.(newHex);
      }
    }
  }, [color.h, color.s, color.l, isInitialized]);

  return (
    <>
      <style
        id="slider-thumb-style"
        dangerouslySetInnerHTML={{
          // For the input range thumb styles. Some things are just easier to add to an external stylesheet.
          // don't actually put this in production.
          // Just putting this here for the sake of a single file in this example
          __html: `
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px; 
                height: 18px;
                background: transparent;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7; 
                cursor: pointer;
                border-radius: 50%;
              }
              input[type='range']::-moz-range-thumb {
                width: 18px;
                height: 18px;
                cursor: pointer;
                border-radius: 50%;
                background: transparent;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7;
              }
              input[type='range']::-ms-thumb {
                width: 18px;
                height: 18px;
                background: transparent;
                cursor: pointer;
                border-radius: 50%;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7;
              }
    
              .dark input[type='range']::-webkit-slider-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              .dark input[type='range']::-moz-range-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              .dark input[type='range']::-ms-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              `,
        }}
      />
      <div
        ref={pickerRef}
        style={
          {
            '--thumb-border-color': '#000000',
            '--thumb-ring-color': '#666666',
          } as React.CSSProperties
        }
        className="z-30 flex w-full max-w-[320px] select-none flex-col items-center gap-3 overscroll-none rounded-2xl border border-border bg-background p-4 shadow-md"
      >
        <DraggableColorCanvas {...color} handleChange={handleColorChange} />
        <input
          type="range"
          min="0"
          max="360"
          value={color.h}
          className="h-3 w-full cursor-pointer appearance-none rounded-full border border-border bg-background text-white placeholder:text-white"
          style={{
            background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
          }}
          onChange={e => {
            const hue = e.target.valueAsNumber;
            setColor(prev => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { hex, ...rest } = { ...prev, h: hue };
              const hex_formatted = hslToHex({ ...rest });
              const newColor = { ...rest, hex: hex_formatted };
              // onChange will be called by useEffect
              return newColor;
            });
          }}
        />
        <div className="relative h-fit w-full">
          <div className="absolute inset-y-0 flex items-center px-[5px]">
            <HashtagIcon className="size-4 text-muted-foreground" />
          </div>
          <input
            id="color-value"
            className={cn(
              'flex w-full items-center justify-between rounded-lg border p-2 text-sm focus:ring-1',
              //10 px for the paddng on the hashtag, 16px for the icon
              'pl-[26px]',
              // 10px for the padding on the color badge, 28px for the color badge
              'pr-[38px]',
              // bg & text
              'bg-muted/25 text-foreground',
              // borders & backgrounds
              'border-border',
              // hover classes
              'hover:border-border/80',
              // focus classes
              'focus:border-primary focus:ring-primary/20',
              // selection styles
              'selection:bg-primary/20 selection:text-foreground'
            )}
            value={color.hex}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleHexInputChange(e.target.value);
            }}
          />
          <div className="absolute inset-y-0 right-0 flex h-full items-center px-[5px]">
            <div
              className="size-7 rounded-md border border-border"
              style={{
                backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
