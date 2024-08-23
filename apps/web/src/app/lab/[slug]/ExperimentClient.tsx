'use client';

import type { JSX } from 'react';
import dynamic from 'next/dynamic';

/**
 * Client-side experiment registry — mirrors EXPERIMENT_REGISTRY in page.tsx.
 * Each entry is wrapped with next/dynamic + ssr:false so Three.js/R3F
 * never runs during server-side prerendering.
 *
 * Add a new entry here whenever you add one to EXPERIMENT_REGISTRY.
 */
const EXPERIMENTS: Record<string, ReturnType<typeof dynamic>> = {
  'noise-sphere': dynamic(() => import('@/experiments/noise-sphere'), { ssr: false }),
  'icosahedron-wireframe': dynamic(() => import('@/experiments/icosahedron-wireframe'), { ssr: false }),
};

export function ExperimentClient({ slug }: { slug: string }): JSX.Element | null {
  const Experiment = EXPERIMENTS[slug];
  if (!Experiment) return null;
  return <Experiment />;
}
