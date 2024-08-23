import type { JSX, ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExperimentClient } from './ExperimentClient';
import styles from './page.module.scss';

interface ExperimentModule {
  default: ComponentType;
  metadata?: { title?: string; description?: string };
}

/**
 * Dynamic experiment registry.
 * Maps slugs to dynamic imports from src/experiments/.
 * Add a new entry here whenever you scaffold a new experiment.
 *
 * TIP: run `make exp name=my-experiment type=web`
 *      The script will append an entry here automatically.
 */
const EXPERIMENT_REGISTRY: Record<string, () => Promise<ExperimentModule>> = {
  'noise-sphere': () => import('@/experiments/noise-sphere'),
  'icosahedron-wireframe': () => import('@/experiments/icosahedron-wireframe'),
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(EXPERIMENT_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loader = EXPERIMENT_REGISTRY[slug];
  if (!loader) return { title: 'Not Found' };
  const mod = await loader();
  return {
    title: mod.metadata?.title ?? slug,
    description: mod.metadata?.description,
  };
}

export default async function LabPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  if (!EXPERIMENT_REGISTRY[slug]) notFound();

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <a href="/" className={styles.back}>
          ← GI LAB
        </a>
        <span className={styles.slug}>{slug}</span>
      </nav>
      <div className={styles.canvas}>
        <ExperimentClient slug={slug} />
      </div>
    </div>
  );
}
