export { poissonDisk } from './math/poisson-disk';
export type { PoissonDiskOptions, Point2D } from './math/poisson-disk';

export { createSpring, createSpring3 } from './math/spring';
export type { Spring, SpringConfig, SpringState } from './math/spring';

export { lSystem, interpretLSystem, L_SYSTEM_PRESETS } from './math/l-system';
export type { LSystemConfig, LSystemResult, LSystemRules, LineSegment, TurtleConfig } from './math/l-system';

export { useKeyboard } from './hooks/use-keyboard';
export type { KeyboardState, UseKeyboardOptions, Key } from './hooks/use-keyboard';

export {
  experimentRegistry,
  webExperiments,
  mobileExperiments,
  getExperimentBySlug,
  getWebExperimentBySlug,
  getMobileExperimentBySlug,
  isWebExperiment,
  isMobileExperiment,
} from './experiments';
export type {
  ExperimentDefinition,
  ExperimentSlug,
  WebExperimentType,
  WebExperimentEntry,
  MobileExperimentEntry,
  WebExperimentSlug,
} from './experiments';

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
export const pingPong = (t: number, length: number) => {
  const L2 = length * 2;
  const mod = ((t % L2) + L2) % L2;
  return mod <= length ? mod : L2 - mod;
};
