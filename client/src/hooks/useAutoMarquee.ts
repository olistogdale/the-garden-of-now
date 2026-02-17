import { useLayoutEffect, useRef } from "react";

export function useAutoMarquee([dependencies = []]: unknown[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const text = container.querySelector<HTMLElement>(".recipe-card__title-text");
    if (!text) return;

    const containerWidth = container.clientWidth;
    const textWidth = text.scrollWidth;

    const overflow = Math.max(0, textWidth - containerWidth);

    const PX_PER_SECOND = 50;
    const duration = overflow > 0 ? overflow / PX_PER_SECOND : 0;

    container.style.setProperty("--scroll-distance", `${overflow}px`);
    container.style.setProperty("--scroll-duration", `${duration}s`);

    container.classList.toggle("is-overflowing", overflow > 0);
  }, [dependencies]);

  return containerRef;
}