'use client';

import { type ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Leva } from 'leva';

interface LevaContextValue {
  hidden: boolean;
  toggle: () => void;
}

const LevaContext = createContext<LevaContextValue>({
  hidden: false,
  toggle: () => {},
});

export const useLeva = () => useContext(LevaContext);

export interface LevaProviderProps {
  children: ReactNode;
  /** Keyboard shortcut to toggle Leva panel (default: 'KeyL') */
  toggleKey?: string;
  /** Start hidden (default: false) */
  defaultHidden?: boolean;
  /** Leva panel title */
  titleBar?: { title?: string; drag?: boolean; filter?: boolean };
}

/**
 * <LevaProvider /> — Wraps your app and provides a toggleable Leva panel.
 *
 * Press `L` (default) to show/hide the controls panel.
 *
 * @example
 * // In layout.tsx:
 * <LevaProvider toggleKey="KeyL">
 *   {children}
 * </LevaProvider>
 */
export function LevaProvider({
  children,
  toggleKey = 'KeyL',
  defaultHidden = false,
  titleBar = { title: 'GI LAB ✦ Controls', drag: true, filter: true },
}: LevaProviderProps) {
  const [hidden, setHidden] = useState(defaultHidden);

  const toggle = useCallback(() => setHidden((h) => !h), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === toggleKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleKey, toggle]);

  return (
    <LevaContext.Provider value={{ hidden, toggle }}>
      <Leva
        hidden={hidden}
        titleBar={titleBar}
        theme={{
          colors: {
            elevation1: '#0d0d14',
            elevation2: '#16161f',
            elevation3: '#1e1e2e',
            accent1: '#00d4cf',
            accent2: '#00a8a4',
            accent3: '#8832ff',
            highlight1: '#9090b8',
            highlight2: '#c0c0d8',
            highlight3: '#ffffff',
          },
        }}
      />
      {children}
    </LevaContext.Provider>
  );
}
