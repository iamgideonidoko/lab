'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { colors } from '@gi-lab/design-tokens';
import { Scene } from '@gi-lab/ui';
import fragmentShader from './noise-sphere.frag';
import vertexShader from './noise-sphere.vert';

const hexToColor = (hex: string) => new THREE.Color(hex);

function NoiseSphereGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { noiseStrength, noiseFrequency, speed, rimPower, wireframe, autoRotate, colorA, colorB } = useControls(
    'Noise Sphere',
    {
      noiseStrength: { value: 0.35, min: 0, max: 1.5, step: 0.01, label: 'Strength' },
      noiseFrequency: { value: 1.8, min: 0.1, max: 6, step: 0.1, label: 'Frequency' },
      speed: { value: 0.18, min: 0, max: 2, step: 0.01, label: 'Speed' },
      rimPower: { value: 3.5, min: 1, max: 8, step: 0.1, label: 'Rim Power' },
      wireframe: { value: false, label: 'Wireframe' },
      autoRotate: { value: true, label: 'Auto Rotate' },
      colorA: { value: colors.primary[500], label: 'Color A (Primary)' },
      colorB: { value: colors.accent[500], label: 'Color B (Accent)' },
    },
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseStrength: { value: noiseStrength },
      uNoiseFrequency: { value: noiseFrequency },
      uSpeed: { value: speed },
      uRimPower: { value: rimPower },
      uColorA: { value: hexToColor(colorA) },
      uColorB: { value: hexToColor(colorB) },
    }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uNoiseStrength.value = noiseStrength;
    uniforms.uNoiseFrequency.value = noiseFrequency;
    uniforms.uSpeed.value = speed;
    uniforms.uRimPower.value = rimPower;
    uniforms.uColorA.value.set(colorA);
    uniforms.uColorB.value.set(colorB);

    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export default function NoiseSphere() {
  return (
    <Scene fov={60} cameraPosition={[0, 0, 5]} background={colors.bg.void} style={{ width: '100%', height: '100%' }}>
      <NoiseSphereGeometry />
      <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={12} makeDefault />
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={colors.primary[300]} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color={colors.accent[400]} />
    </Scene>
  );
}

export const metadata = {
  title: 'Noise Sphere',
  description: 'Simplex noise displacement on an icosahedron. Shift colors with Leva controls.',
};
