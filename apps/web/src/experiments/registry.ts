import type { ComponentType } from 'react';
import type { WebExperimentSlug } from '@gi-lab/utils';

interface ExperimentModule {
  default: ComponentType;
  metadata?: { title?: string; description?: string };
}

export const webExperimentLoaders: Record<WebExperimentSlug, () => Promise<ExperimentModule>> = {
  'noise-sphere': () => import('@/experiments/noise-sphere'),
  'icosahedron-wireframe': () => import('@/experiments/icosahedron-wireframe'),
};
