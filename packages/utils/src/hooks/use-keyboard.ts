'use client';

import { useEffect, useRef, useCallback } from 'react';

export type Key = string;

export interface KeyboardState {
  /** Set of currently pressed keys */
  pressed: Set<Key>;
  /** Check if a key is currently held */
  isHeld: (key: Key) => boolean;
}

export interface UseKeyboardOptions {
  /** Target element — defaults to window */
  target?: EventTarget | null;
  /** Prevent default browser behavior for these keys */
  preventDefault?: Key[];
  /** Only fire when component is mounted */
  enabled?: boolean;
}

/**
 * useKeyboard — tracks held keys and dispatches callbacks
 *
 * @example
 * const { isHeld } = useKeyboard({
 *   onKeyDown: (key) => { if (key === 'Space') togglePause() },
 * })
 *
 * // In render loop:
 * if (isHeld('ArrowLeft')) camera.position.x -= speed
 */
export function useKeyboard(
  options: UseKeyboardOptions & {
    onKeyDown?: (key: Key, event: KeyboardEvent) => void;
    onKeyUp?: (key: Key, event: KeyboardEvent) => void;
  } = {},
): KeyboardState {
  const { onKeyDown, onKeyUp, preventDefault = [], enabled = true } = options;
  const pressed = useRef(new Set<Key>());
  const onKeyDownRef = useRef(onKeyDown);
  const onKeyUpRef = useRef(onKeyUp);

  // Keep callbacks fresh without re-subscribing
  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);
  useEffect(() => {
    onKeyUpRef.current = onKeyUp;
  }, [onKeyUp]);

  useEffect(() => {
    if (!enabled) return;

    const target = options.target ?? window;

    const handleKeyDown = (e: Event) => {
      const event = e as KeyboardEvent;
      if (preventDefault.includes(event.code) || preventDefault.includes(event.key)) {
        event.preventDefault();
      }
      pressed.current.add(event.code);
      pressed.current.add(event.key);
      onKeyDownRef.current?.(event.code, event);
    };

    const handleKeyUp = (e: Event) => {
      const event = e as KeyboardEvent;
      pressed.current.delete(event.code);
      pressed.current.delete(event.key);
      onKeyUpRef.current?.(event.code, event);
    };

    const handleBlur = () => pressed.current.clear();

    target.addEventListener('keydown', handleKeyDown);
    target.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
      target.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      pressed.current.clear();
    };
  }, [enabled, options.target]); // eslint-disable-line react-hooks/exhaustive-deps

  const isHeld = useCallback((key: Key) => pressed.current.has(key), []);

  return { pressed: pressed.current, isHeld };
}
