'use client';

import type { JSX } from 'react';
import dynamic from 'next/dynamic';
import type { WebExperimentSlug } from '@gi-lab/utils';
import { webExperimentLoaders } from '@/experiments/registry';

const webExperimentClients = Object.fromEntries(
  Object.entries(webExperimentLoaders).map(([slug, loader]) => [slug, dynamic(loader, { ssr: false })]),
) as Record<WebExperimentSlug, ReturnType<typeof dynamic>>;

export function ExperimentClient({ slug }: { slug: string }): JSX.Element | null {
  const Experiment = webExperimentClients[slug as keyof typeof webExperimentClients];
  if (!Experiment) return null;
  return <Experiment />;
}
