"use client";

import { useEffect, useRef } from "react";

const VISIBLE_SHARE = 0.25;

interface ImageRevealProps {
  delay?: number;
  children: React.ReactNode;
}

export function ImageReveal({ delay = 0, children }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    document.documentElement.dataset.revealReady = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_SHARE },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay * 1000}ms` } as React.CSSProperties}
      className="image-reveal absolute inset-0"
    >
      <div className="image-reveal-clip absolute inset-0">
        <div className="image-reveal-zoom absolute inset-0">{children}</div>
      </div>
    </div>
  );
}
