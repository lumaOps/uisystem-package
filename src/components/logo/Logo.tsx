import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

/**
 * Logo configuration constants
 */
const LOGO_CONFIG = {
  LIGHT: '/logo/Logo-light.svg',
  DARK: '/logo/Logo.svg',
  MIN_LIGHT: '/logo/Logo-sm-light.svg',
  MIN_DARK: '/logo/Logo-sm.svg',
  DEFAULT_WIDTH: 120,
  DEFAULT_HEIGHT: 48,
} as const;

/**
 * Props interface for Logo component
 */
interface LogoProps {
  isOpen: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Reusable Logo component with light/dark mode and open/minimized support
 */
const Logo: React.FC<LogoProps> = React.memo(
  ({
    isOpen,
    className,
    width = LOGO_CONFIG.DEFAULT_WIDTH,
    height = LOGO_CONFIG.DEFAULT_HEIGHT,
  }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
      setMounted(true);
    }, []);

    const logoSrc = useMemo(() => {
      if (!mounted) {
        return isOpen ? LOGO_CONFIG.LIGHT : LOGO_CONFIG.MIN_LIGHT;
      }

      if (isOpen) {
        return resolvedTheme === 'dark' ? LOGO_CONFIG.LIGHT : LOGO_CONFIG.DARK;
      }
      return resolvedTheme === 'dark' ? LOGO_CONFIG.MIN_LIGHT : LOGO_CONFIG.MIN_DARK;
    }, [isOpen, resolvedTheme, mounted]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
      return (
        <div className={className || 'flex justify-center items-center h-12'}>
          <div style={{ width, height }} />
        </div>
      );
    }

    return (
      <div className={className || 'flex justify-center items-center h-12'}>
        <Image
          src={logoSrc}
          alt="Logo"
          width={width}
          height={height}
          className="h-auto w-auto"
          priority
        />
      </div>
    );
  }
);

Logo.displayName = 'Logo';

export default Logo;
