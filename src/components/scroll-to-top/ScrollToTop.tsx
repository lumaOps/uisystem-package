'use client';

import { CustomButton } from '@/components/button/CustomButton';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScrollToTopProps {
  className?: string;
  threshold?: number;
}

export const ScrollToTop = ({ className, threshold = 300 }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the actual scrolling container
      let scrollTop = 0;

      // Check main content area first (this is likely where the scroll happens)
      const mainElement = document.querySelector('main');
      if (mainElement && mainElement.scrollTop > 0) {
        scrollTop = mainElement.scrollTop;
      } else {
        // Check for overflow-y-auto containers
        const scrollContainers = document.querySelectorAll('[class*="overflow-y-auto"]');
        for (const container of scrollContainers) {
          if (container.scrollTop > 0) {
            scrollTop = Math.max(scrollTop, container.scrollTop);
          }
        }

        // Fallback to window scroll
        if (scrollTop === 0) {
          scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        }
      }

      setIsVisible(scrollTop > threshold);
    };

    // Add listeners to multiple potential scroll sources
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    // Add listeners to all potential scrolling containers
    const mainElement = document.querySelector('main');
    const scrollContainers = document.querySelectorAll(
      '[class*="overflow-y-auto"], [class*="overflow-auto"]'
    );

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);

      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }

      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [threshold]);

  const scrollToTop = () => {
    // Find and scroll the actual container
    let scrolled = false;

    // Try main element first
    const mainElement = document.querySelector('main');
    if (mainElement && mainElement.scrollTop > 0) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
      scrolled = true;
    }

    // Try overflow containers
    if (!scrolled) {
      const scrollContainers = document.querySelectorAll(
        '[class*="overflow-y-auto"], [class*="overflow-auto"]'
      );
      for (const container of scrollContainers) {
        if (container.scrollTop > 0) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
          scrolled = true;
          break;
        }
      }
    }

    // Fallback to window
    if (!scrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <CustomButton
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-110 ${className || ''}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </CustomButton>
  );
};
