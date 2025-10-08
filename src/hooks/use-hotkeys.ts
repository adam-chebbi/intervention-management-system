// Inspired by https://github.com/JohannesKlauss/react-hotkeys-hook
'use client';
import { useEffect, useCallback } from 'react';

type Hotkey = [string, (e: KeyboardEvent) => void, { metaKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }?];

export function useHotkeys(hotkeys: Hotkey[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const [key, callback, options = {}] of hotkeys) {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          !!event.metaKey === !!options.metaKey &&
          !!event.shiftKey === !!options.shiftKey &&
          !!event.ctrlKey === !!options.ctrlKey
        ) {
          event.preventDefault();
          callback(event);
        }
      }
    },
    [hotkeys]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
