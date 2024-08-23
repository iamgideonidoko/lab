import type { ReactNode, JSX } from 'react';
import type { Metadata, Viewport } from 'next';
import { LevaProvider } from '@gi-lab/ui';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: {
    template: '%s | GI LAB',
    default: 'GI LAB — Creative Coding Experiments',
  },
  description: 'A 3D/Creative Coding playground built with React Three Fiber, Next.js, and Expo.',
  keywords: ['creative coding', 'three.js', 'react three fiber', 'generative art', 'WebGL'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050507',
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LevaProvider defaultHidden={false} toggleKey="KeyL">
          {children}
        </LevaProvider>
      </body>
    </html>
  );
}
