'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

/** Animates from 0 up to `value` once it scrolls into view. Used for the stats strip. */
export function Counter({ value, suffix = '', duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const { ref, isVisible } = useIntersection<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
