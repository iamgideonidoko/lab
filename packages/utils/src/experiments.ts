export type WebExperimentType = 'web' | 'web-native';

export interface ExperimentDefinition {
  slug: string;
  title: string;
  web?: {
    type: WebExperimentType;
    tags: readonly string[];
    description: string;
  };
  mobile?: {
    description: string;
  };
}

export const experimentRegistry = [
  {
    slug: 'noise-sphere',
    title: 'Noise Sphere',
    web: {
      type: 'web',
      tags: ['noise', 'geometry'],
      description: 'Simplex noise displacement on an icosahedron. Shift colors with Leva controls.',
    },
    mobile: {
      description: 'Animated token-driven field study',
    },
  },
  {
    slug: 'icosahedron-wireframe',
    title: 'Icosahedron Wireframe (Orbit Controls)',
    web: {
      type: 'web-native',
      tags: ['three', 'standalone'],
      description: 'Web-native Icosahedron Wireframe (Orbit Controls) showcase.',
    },
  },
] as const satisfies readonly ExperimentDefinition[];

type RegistryEntry = (typeof experimentRegistry)[number];

export type ExperimentSlug = RegistryEntry['slug'];
export type WebExperimentEntry = Extract<
  RegistryEntry,
  {
    web: {
      type: WebExperimentType;
      tags: readonly string[];
      description: string;
    };
  }
>;
export type MobileExperimentEntry = Extract<
  RegistryEntry,
  {
    mobile: {
      description: string;
    };
  }
>;
export type WebExperimentSlug = WebExperimentEntry['slug'];

export function isWebExperiment(experiment: RegistryEntry): experiment is WebExperimentEntry {
  return 'web' in experiment;
}

export function isMobileExperiment(experiment: RegistryEntry): experiment is MobileExperimentEntry {
  return 'mobile' in experiment;
}

export const webExperiments = experimentRegistry.filter(isWebExperiment);
export const mobileExperiments = experimentRegistry.filter(isMobileExperiment);

export function getExperimentBySlug(slug: string): RegistryEntry | undefined {
  return experimentRegistry.find((experiment) => experiment.slug === slug);
}

export function getWebExperimentBySlug(slug: string): WebExperimentEntry | undefined {
  return webExperiments.find((experiment) => experiment.slug === slug);
}

export function getMobileExperimentBySlug(slug: string): MobileExperimentEntry | undefined {
  return mobileExperiments.find((experiment) => experiment.slug === slug);
}
