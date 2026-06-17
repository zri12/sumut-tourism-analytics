"use client";

import { useEffect, useRef, useState } from "react";

export default function ChartFrame({ className = "h-72", children }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return undefined;

    const updateSize = () => {
      const rect = ref.current.getBoundingClientRect();
      setSize({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const ready = size.width > 0 && size.height > 0;

  return (
    <div ref={ref} className={`min-w-0 ${className}`}>
      {ready ? children(size) : <div className="h-full w-full rounded-xl bg-slate-50" />}
    </div>
  );
}
