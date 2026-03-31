"use client";

import { useEffect, useState, useRef } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(target: number, duration: number = 900): number {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setValue(easedProgress * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(update);
  }, [target, duration]);

  return value;
}
