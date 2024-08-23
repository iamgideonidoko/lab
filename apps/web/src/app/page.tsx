import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.scss';

export const metadata: Metadata = { title: 'GI LAB' };

const EXPERIMENTS = [
  { slug: 'noise-sphere', title: 'Noise Sphere', type: 'web', tags: ['noise', 'geometry'] },
  {
    slug: 'icosahedron-wireframe',
    title: 'Icosahedron Wireframe (Orbit Controls)',
    type: 'web-native',
    tags: ['three', 'standalone'],
  },
] as const;

export default function HomePage(): JSX.Element {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <span className={styles.label}>GI LAB</span>
        <h1 className={styles.title}>Creative Experiments</h1>
        <p className={styles.subtitle}>3D, clone studies, generative system, and bare-metal web prototypes.</p>
      </header>

      <section className={styles.grid}>
        {EXPERIMENTS.map((experiment) => (
          <Link key={experiment.slug} href={`/lab/${experiment.slug}`} className={styles.card}>
            <div className={styles.cardPreview} aria-label={`Preview of ${experiment.title}`} />
            <div className={styles.cardMeta}>
              <span className={styles.cardType}>{experiment.type.toUpperCase()}</span>
              <h2 className={styles.cardTitle}>{experiment.title}</h2>
              <div className={styles.cardTags}>
                {experiment.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
