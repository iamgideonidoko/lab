'use client';

import { type ReactNode, type CSSProperties } from 'react';
import { Canvas, type RootState } from '@react-three/fiber';
import { type PerformanceMonitorApi } from '@react-three/drei';
import { colors } from '@gi-lab/design-tokens';

export interface SceneProps {
  children: ReactNode;
  /** Canvas className */
  className?: string;
  style?: CSSProperties;
  /** Camera field of view (default: 60) */
  fov?: number;
  /** Camera near/far (default: [0.1, 100]) */
  near?: number;
  far?: number;
  /** Camera position (default: [0, 0, 5]) */
  cameraPosition?: [number, number, number];
  /** Background color (default: design token bg.void) */
  background?: string | null;
  /** Enable shadows (default: true) */
  shadows?: boolean | 'soft' | 'variance' | 'basic';
  /** Device pixel ratio (default: [1, 2]) */
  dpr?: [number, number] | number;
  /** Called on each frame — access via useFrame inside children */
  onCreated?: (state: RootState) => void;
  /** Performance monitor callback */
  onPerformanceChange?: (api: PerformanceMonitorApi) => void;
}

/**
 * <Scene /> — The universal R3F canvas wrapper.
 *
 * Pre-configured with:
 * - ACESFilmic tone mapping
 * - Soft shadows (PCFSoftShadowMap)
 * - Adaptive DPR [1, 2]
 * - Design token background color
 *
 * @example
 * <Scene fov={75} cameraPosition={[0, 2, 8]}>
 *   <NoiseSphere />
 *   <ambientLight intensity={0.5} />
 * </Scene>
 */
export function Scene({
  children,
  className,
  style,
  fov = 60,
  near = 0.1,
  far = 100,
  cameraPosition = [0, 0, 5],
  background = colors.bg.void,
  shadows = 'soft',
  dpr = [1, 2],
  onCreated,
}: SceneProps) {
  return (
    <Canvas
      className={className}
      style={{ background: background ?? 'transparent', ...style }}
      shadows={shadows}
      dpr={dpr}
      camera={{ fov, near, far, position: cameraPosition }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      onCreated={(state) => {
        // ACESFilmic tone mapping for cinematic look
        state.gl.toneMapping = 4; // THREE.ACESFilmicToneMapping
        state.gl.toneMappingExposure = 1.0;
        onCreated?.(state);
      }}
    >
      {children}
    </Canvas>
  );
}
