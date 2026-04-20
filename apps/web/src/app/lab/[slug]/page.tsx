import type { JSX } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWebExperimentBySlug } from '@gi-lab/utils';
import { ExperimentClient } from './ExperimentClient';
import styles from './page.module.scss';
import { webExperimentLoaders } from '@/experiments/registry';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(webExperimentLoaders).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getWebExperimentBySlug(slug);
  if (!experiment) return { title: 'Not Found' };
  return {
    title: experiment.title,
    description: experiment.web.description,
  };
}

export default async function LabPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  if (!getWebExperimentBySlug(slug)) notFound();

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
