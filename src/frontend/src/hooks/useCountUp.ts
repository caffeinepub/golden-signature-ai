import { useEffect, useRef, useState } from "react";

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useCountUp(
  target: number,
  duration = 1500,
  startOnMount = true,
): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnMount) return;

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, startOnMount]);

  return count;
}
