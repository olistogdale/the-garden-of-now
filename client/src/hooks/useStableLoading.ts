import { useEffect, useRef, useState } from 'react';

type Options = {
  delayMs?: number;
  minShowMs?: number;
};

export function useStableLoading(
  isLoading: boolean,
  { delayMs = 0, minShowMs = 500 }: Options = {},
) {
  const [show, setShow] = useState(false);

  const delayTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    const clearDelay = () => {
      if (delayTimer.current !== null) window.clearTimeout(delayTimer.current);
      delayTimer.current = null;
    };

    const clearHide = () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    };

    if (isLoading) {
      clearHide();

      if (show) return;

      clearDelay();
      delayTimer.current = window.setTimeout(() => {
        shownAt.current = Date.now();
        setShow(true);
      }, delayMs);

      return () => {
        clearDelay();
      };
    }

    clearDelay();

    if (!show) return;

    const elapsed = shownAt.current ? Date.now() - shownAt.current : Infinity;
    const remaining = Math.max(0, minShowMs - elapsed);

    clearHide();
    hideTimer.current = window.setTimeout(() => {
      setShow(false);
      shownAt.current = null;
    }, remaining);

    return () => {
      clearDelay();
      clearHide();
    };
  }, [isLoading, delayMs, minShowMs, show]);

  return show;
}
