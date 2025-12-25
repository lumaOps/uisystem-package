import { useState, useEffect } from 'react';

export function useIsSmallDesktop(breakpoint: number = 1024): boolean {
  const [isSmallDesktop, setIsSmallDesktop] = useState(false);

  useEffect(() => {
    const checkIsSmallDesktop = () => {
      setIsSmallDesktop(window.innerWidth < breakpoint);
    };

    checkIsSmallDesktop();
    window.addEventListener('resize', checkIsSmallDesktop);
    return () => window.removeEventListener('resize', checkIsSmallDesktop);
  }, [breakpoint]);

  return isSmallDesktop;
}

