import { useEffect, useRef } from 'react';

/**
 * Calls `onOutside` when a pointer/touch event lands outside the returned ref.
 * Headless helper for dismissable overlays such as dropdown panels.
 */
export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handle(event: MouseEvent | TouchEvent) {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [onOutside]);

  return ref;
}
