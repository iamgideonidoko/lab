#!/usr/bin/env node
/**
 * New Experiment Scaffolder
 * Usage: make exp name=my-experiment type=(web|web-native|mobile)
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2).reduce<Record<string, string>>((acc, arg) => {
  const parts = arg.replace(/^--/, '').split('=');
  const key = parts[0];
  const value = parts[1];
  if (key && value) acc[key] = value;
  return acc;
}, {});

const name: string | undefined = args['name'];
const type: string = args['type'] ?? 'web';

if (!name) {
  console.error('❌  Usage: make exp name=<name> type=<web|web-native|mobile>');
  process.exit(1);
}

if (!['web', 'web-native', 'mobile'].includes(type)) {
  console.error(`❌  Invalid type "${type}". Use: web | web-native | mobile`);
  process.exit(1);
}

const slug = name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const titleCase = slug
  .split('-')
  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');

const componentName = titleCase.replace(/ /g, '');

const WEB_EXPERIMENT_DIR = resolve(ROOT, 'apps/web/src/experiments', slug);
const MOBILE_EXPERIMENT_DIR = resolve(ROOT, 'apps/mobile/app/experiments');
const MOBILE_EXPERIMENT_PATH = resolve(MOBILE_EXPERIMENT_DIR, `${slug}.tsx`);
const SHARED_EXPERIMENTS_PATH = resolve(ROOT, 'packages/utils/src/experiments.ts');
const WEB_REGISTRY_PATH = resolve(ROOT, 'apps/web/src/experiments/registry.ts');

const WEB_TEMPLATE = `'use client'

import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import { colors } from '@gi-lab/design-tokens'
import { Scene } from '@gi-lab/ui'
import styles from './${slug}.module.scss'
// Optional shader sandbox:
// import displacementGLSL from './${slug}.glsl'

const orbitNodes = Array.from({ length: 12 }, (_, i) => i)

function ${componentName}Mesh() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)

  const { speed, amplitude, scale, wireframe } = useControls('${titleCase}', {
    speed: { value: 0.4, min: 0, max: 2, step: 0.01 },
    amplitude: { value: 0.3, min: 0, max: 1.5, step: 0.01 },
    scale: { value: 1.15, min: 0.4, max: 2.4, step: 0.01 },
    wireframe: { value: false },
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.8
      meshRef.current.rotation.x = Math.sin(t * 0.6) * 0.2
      meshRef.current.position.y = Math.sin(t * 1.2) * amplitude * 0.18
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.16 + Math.sin(t * 1.8) * 0.06
      materialRef.current.wireframe = wireframe
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.2}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1.25, 5]} />
        <meshStandardMaterial
          ref={materialRef}
          color={colors.primary[500]}
          emissive={colors.accent[500]}
          emissiveIntensity={0.16}
          roughness={0.2}
          metalness={0.18}
        />
      </mesh>
    </Float>
  )
}

export default function ${componentName}() {
  return (
    <main className={styles.root}>
      <section className={styles.stage}>
        <div className={styles.canvas}>
          <Scene
            fov={55}
            cameraPosition={[0, 0, 5]}
            background={colors.bg.void}
            style={{ width: '100%', height: '100%' }}
          >
            <${componentName}Mesh />
            <OrbitControls enablePan={false} makeDefault />
            <ambientLight intensity={0.35} />
            <pointLight position={[4, 4, 4]} intensity={18} color={colors.primary[300]} />
            <pointLight position={[-4, -2, -3]} intensity={10} color={colors.accent[400]} />
          </Scene>
        </div>

        <div className={styles.overlay}>
          <span className={styles.badge}>web experiment</span>

          <div className={styles.meta}>
            <h1 className={styles.title}>${titleCase}</h1>
            <p className={styles.description}>
              A merged starter that combines a React Three Fiber scene with SCSS-driven motion
              overlays, layout, and labels.
            </p>

            <div className={styles.stats}>
              <span className={styles.stat}>r3f scene</span>
              <span className={styles.stat}>scss motion</span>
              <span className={styles.stat}>design tokens</span>
            </div>
          </div>

          <div className={styles.orbit} aria-hidden>
            {orbitNodes.map((i) => (
              <span key={i} className={styles.node} style={{ '--index': i } as CSSProperties} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export const metadata = {
  title: '${titleCase}',
  description: 'Merged web experiment with R3F scene setup and SCSS overlays.',
}
`;

const WEB_GLSL_PLACEHOLDER = `// ${titleCase} — optional displacement playground
// Import this into index.tsx whenever you want to graduate the starter into
// a custom shader-driven experiment.

uniform float uTime;
uniform float uStrength;

varying vec3 vPosition;

void main() {
  vPosition = position;
  vec3 displaced = position + normal * sin(uTime + position.y * 4.0) * uStrength;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const WEB_MODULE_TEMPLATE = `@use "../../styles/tokens.generated" as tokens;

.root {
  min-height: 100dvh;
  padding: 24px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(tokens.$accent, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(tokens.$primary, 0.06), transparent 30%),
    tokens.$bg-void;
  overflow: hidden;
}

.stage {
  position: relative;
  width: min(100%, 1120px);
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 32px;
  border: 1px solid rgba(tokens.$primary, 0.16);
  background:
    linear-gradient(180deg, rgba(tokens.$neutral-100, 0.03), rgba(tokens.$neutral-100, 0)),
    rgba(tokens.$bg-surface, 0.82);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.canvas {
  position: absolute;
  inset: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(20px, 3vw, 32px);
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(tokens.$bg-void, 0.68), transparent 38%),
    linear-gradient(0deg, rgba(tokens.$bg-void, 0.75), transparent 30%);
}

.badge {
  align-self: flex-start;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(tokens.$primary, 0.24);
  background: rgba(tokens.$bg-surface, 0.58);
  color: rgba(tokens.$primary, 0.95);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
}

.meta {
  display: grid;
  gap: 14px;
  max-width: 360px;
}

.title {
  margin: 0;
  color: tokens.$neutral-50;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.description {
  margin: 0;
  color: rgba(tokens.$neutral-200, 0.8);
  font-size: 15px;
  line-height: 1.6;
}

.stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat {
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(tokens.$bg-surface, 0.54);
  border: 1px solid rgba(tokens.$neutral-100, 0.08);
  color: rgba(tokens.$neutral-100, 0.78);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  backdrop-filter: blur(14px);
}

.orbit {
  position: absolute;
  right: clamp(20px, 3vw, 32px);
  bottom: clamp(20px, 3vw, 32px);
  width: min(26vw, 220px);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid rgba(tokens.$primary, 0.12);
  background: radial-gradient(circle, rgba(tokens.$primary, 0.08), transparent 60%);
  animation: pulse 4.6s ease-in-out infinite;
}

.node {
  --index: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(tokens.$primary, 0.92);
  transform:
    translate(-50%, -50%)
    rotate(calc(var(--index) * 30deg))
    translateY(-38%);
  box-shadow:
    0 0 14px rgba(tokens.$primary, 0.8),
    0 0 32px rgba(tokens.$accent, 0.22);
  animation: drift 5.4s ease-in-out infinite;
  animation-delay: calc(var(--index) * 120ms);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes drift {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}
`;

const WEB_NATIVE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${titleCase} — GI LAB</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050507; overflow: hidden; }
    canvas { display: block; }
    #info {
      position: fixed; top: 20px; left: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
      color: rgba(0, 212, 207, 0.6);
    }
  </style>
</head>
<body>
  <div id="info">GI LAB / ${slug} / web-native</div>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/"
      }
    }
  </script>
  <script type="module">
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

    const COLORS = {
      primary: 0x00d4cf,
      accent:  0x8832ff,
      bg:      0x050507,
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    document.body.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    scene.background = new THREE.Color(COLORS.bg)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const geometry = new THREE.IcosahedronGeometry(1.8, 4)
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.primary,
      wireframe: true,
      opacity: 0.4,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const primaryLight = new THREE.PointLight(COLORS.primary, 2, 20)
    primaryLight.position.set(4, 4, 4)
    scene.add(primaryLight)
    const accentLight = new THREE.PointLight(COLORS.accent, 1.5, 20)
    accentLight.position.set(-4, -4, -2)
    scene.add(accentLight)

    const clock = new THREE.Clock()
    function animate() {
      requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      mesh.rotation.y = t * 0.2
      mesh.rotation.x = t * 0.08
      const s = 1 + Math.sin(t * 0.6) * 0.08
      mesh.scale.setScalar(s)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
  </script>
</body>
</html>
`;

const WEB_NATIVE_WRAPPER = `'use client'

export default function ${componentName}() {
  return (
    <iframe
      src="/exp/${slug}/index.html"
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="${titleCase}"
    />
  )
}

export const metadata = {
  title: '${titleCase}',
  description: 'Standalone web-native experiment rendered from a static HTML entry.',
}
`;

const MOBILE_TEMPLATE = `import { Stack } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { colors, CUBIC_BEZIER, DURATION } from '@gi-lab/design-tokens'

const haloOffsets = [
  { top: 52, left: 24 },
  { top: 116, left: 228 },
  { top: 264, left: 42 },
  { top: 328, left: 244 },
] as const

function Halo({ index, top, left }: { index: number; top: number; left: number }) {
  const scale = useSharedValue(0.7)
  const opacity = useSharedValue(0.2)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.08, {
        duration: DURATION.slow + index * 120,
        easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
      }),
      -1,
      true,
    )

    opacity.value = withRepeat(
      withTiming(0.88, {
        duration: DURATION.normal + index * 80,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    )
  }, [index, opacity, scale])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      className="absolute h-28 w-28 rounded-full"
      style={[
        {
          top,
          left,
          backgroundColor: index % 2 === 0 ? colors.primary[500] : colors.accent[500],
        },
        animStyle,
      ]}
    />
  )
}

export default function ${componentName}Screen() {
  const cardY = useSharedValue(28)
  const cardOpacity = useSharedValue(0)
  const titleOpacity = useSharedValue(0)

  useEffect(() => {
    cardY.value = withTiming(0, {
      duration: DURATION.slow,
      easing: Easing.bezier(...CUBIC_BEZIER.outExpo),
    })
    cardOpacity.value = withTiming(1, { duration: DURATION.normal })
    titleOpacity.value = withTiming(1, { duration: DURATION.slow })
  }, [cardOpacity, cardY, titleOpacity])

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }))

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }))

  return (
    <>
      <Stack.Screen options={{ title: '${titleCase}' }} />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.bg.void }}
        contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 20 }}
      >
        <Animated.View style={titleStyle}>
          <Text
            className="mb-3 text-xs uppercase tracking-widest"
            style={{ color: colors.primary[500], fontFamily: 'monospace' }}
          >
            mobile experiment
          </Text>
          <Text className="mb-3 text-4xl font-bold tracking-tight" style={{ color: colors.neutral[50] }}>
            ${titleCase}
          </Text>
          <Text className="max-w-sm text-base leading-relaxed" style={{ color: colors.neutral[400] }}>
            Native motion starter with token-driven color, layered depth, and reanimated timing ready
            for your next mobile study.
          </Text>
        </Animated.View>

        <Animated.View
          className="overflow-hidden rounded-[32px] border border-white/10"
          style={[
            {
              minHeight: 460,
              backgroundColor: colors.bg.surface,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 28,
              shadowOffset: { width: 0, height: 16 },
              elevation: 20,
            },
            cardStyle,
          ]}
        >
          <View className="absolute inset-0">
            <View className="absolute inset-x-0 top-0 h-40" style={{ backgroundColor: colors.bg.elevated }} />
            {haloOffsets.map((halo, index) => (
              <Halo key={index} index={index} top={halo.top} left={halo.left} />
            ))}
          </View>

          <View className="flex-1 justify-between p-6">
            <View className="flex-row flex-wrap gap-3">
              <View
                className="rounded-full border border-white/10 px-3 py-2"
                style={{ backgroundColor: colors.bg.elevated }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: colors.primary[500], fontFamily: 'monospace' }}
                >
                  reanimated
                </Text>
              </View>
              <View
                className="rounded-full border border-white/10 px-3 py-2"
                style={{ backgroundColor: colors.bg.elevated }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: colors.neutral[300], fontFamily: 'monospace' }}
                >
                  design tokens
                </Text>
              </View>
              <View
                className="rounded-full border border-white/10 px-3 py-2"
                style={{ backgroundColor: colors.bg.elevated }}
              >
                <Text
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: colors.accent[400], fontFamily: 'monospace' }}
                >
                  native layers
                </Text>
              </View>
            </View>

            <View>
              <Text className="mb-2 text-2xl font-semibold" style={{ color: colors.neutral[50] }}>
                Build from motion first.
              </Text>
              <Text className="max-w-xs text-sm leading-6" style={{ color: colors.neutral[300] }}>
                Swap the halos for particles, gestures, sensors, or procedural views. The animation rhythm
                and visual layering are already in place.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  )
}
`;

function findExperimentBlockBounds(source: string, experimentSlug: string): { start: number; end: number } | null {
  const slugIndex = source.indexOf(`slug: '${experimentSlug}',`);
  if (slugIndex === -1) return null;

  const start = source.lastIndexOf('  {', slugIndex);
  if (start === -1) return null;

  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start, end: index };
      }
    }
  }

  return null;
}

async function registerExperimentMetadata(surface: 'web' | 'mobile'): Promise<void> {
  const registrySource = await readFile(SHARED_EXPERIMENTS_PATH, 'utf8');
  let nextSource = registrySource;

  const webBlock = `    web: {\n      type: '${type}',\n      tags: ['todo'],\n      description: 'TODO: describe this ${type} experiment',\n    },\n`;
  const mobileBlock = `    mobile: {\n      description: 'TODO: describe this mobile experiment',\n    },\n`;

  const existingBounds = findExperimentBlockBounds(nextSource, slug);

  if (existingBounds) {
    const existingBlock = nextSource.slice(existingBounds.start, existingBounds.end + 1);
    const alreadyRegistered = surface === 'web' ? existingBlock.includes('\n    web: {') : existingBlock.includes('\n    mobile: {');

    if (!alreadyRegistered) {
      const blockToInsert = surface === 'web' ? webBlock : mobileBlock;
      nextSource =
        nextSource.slice(0, existingBounds.end) + blockToInsert + nextSource.slice(existingBounds.end);
    }
  } else {
    const newEntry =
      surface === 'web'
        ? `  {\n    slug: '${slug}',\n    title: '${titleCase}',\n    web: {\n      type: '${type}',\n      tags: ['todo'],\n      description: 'TODO: describe this ${type} experiment',\n    },\n  },`
        : `  {\n    slug: '${slug}',\n    title: '${titleCase}',\n    mobile: {\n      description: 'TODO: describe this mobile experiment',\n    },\n  },`;

    nextSource = nextSource.replace(/(export const experimentRegistry = \[)/, `$1\n${newEntry}`);
  }

  if (nextSource !== registrySource) {
    await writeFile(SHARED_EXPERIMENTS_PATH, nextSource);
    console.log(`✦  Registered in shared registry:    packages/utils/src/experiments.ts`);
  }
}

async function registerWebExperiment(): Promise<void> {
  const registrySource = await readFile(WEB_REGISTRY_PATH, 'utf8');
  let nextSource = registrySource;
  const loaderEntry = `  '${slug}': () => import('@/experiments/${slug}'),`;

  if (!nextSource.includes(loaderEntry)) {
    nextSource = nextSource.replace(/(export const webExperimentLoaders:[^{]+\{)/, `$1\n${loaderEntry}`);
  }

  if (nextSource !== registrySource) {
    await writeFile(WEB_REGISTRY_PATH, nextSource);
    console.log(`✦  Registered in web registry:       apps/web/src/experiments/registry.ts`);
  }
}

async function registerMobileExperiment(): Promise<void> {
  await registerExperimentMetadata('mobile');
}

async function createWebExperiment(): Promise<void> {
  if (existsSync(WEB_EXPERIMENT_DIR)) {
    console.error(`❌  Experiment "${slug}" already exists at ${WEB_EXPERIMENT_DIR}`);
    process.exit(1);
  }

  await mkdir(WEB_EXPERIMENT_DIR, { recursive: true });
  await writeFile(resolve(WEB_EXPERIMENT_DIR, 'index.tsx'), WEB_TEMPLATE);
  await writeFile(resolve(WEB_EXPERIMENT_DIR, `${slug}.module.scss`), WEB_MODULE_TEMPLATE);
  await writeFile(resolve(WEB_EXPERIMENT_DIR, `${slug}.glsl`), WEB_GLSL_PLACEHOLDER);
  await registerExperimentMetadata('web');
  await registerWebExperiment();

  console.log(`✦  Created web experiment:`);
  console.log(`   apps/web/src/experiments/${slug}/index.tsx`);
  console.log(`   apps/web/src/experiments/${slug}/${slug}.module.scss`);
  console.log(`   apps/web/src/experiments/${slug}/${slug}.glsl`);
}

async function createWebNativeExperiment(): Promise<void> {
  if (existsSync(WEB_EXPERIMENT_DIR)) {
    console.error(`❌  Experiment "${slug}" already exists at ${WEB_EXPERIMENT_DIR}`);
    process.exit(1);
  }

  await mkdir(WEB_EXPERIMENT_DIR, { recursive: true });
  const webNativeDir = resolve(ROOT, `apps/web/public/exp/${slug}`);
  await mkdir(webNativeDir, { recursive: true });
  await writeFile(resolve(webNativeDir, 'index.html'), WEB_NATIVE_TEMPLATE);
  await writeFile(resolve(WEB_EXPERIMENT_DIR, 'index.tsx'), WEB_NATIVE_WRAPPER);
  await registerExperimentMetadata('web');
  await registerWebExperiment();

  console.log(`✦  Created web-native experiment:`);
  console.log(`   apps/web/public/exp/${slug}/index.html`);
  console.log(`   apps/web/src/experiments/${slug}/index.tsx (iframe wrapper)`);
}

async function createMobileExperiment(): Promise<void> {
  if (existsSync(MOBILE_EXPERIMENT_PATH)) {
    console.error(`❌  Experiment "${slug}" already exists at ${MOBILE_EXPERIMENT_PATH}`);
    process.exit(1);
  }

  await mkdir(MOBILE_EXPERIMENT_DIR, { recursive: true });
  await writeFile(MOBILE_EXPERIMENT_PATH, MOBILE_TEMPLATE);
  await registerMobileExperiment();

  console.log(`✦  Created mobile experiment:`);
  console.log(`   apps/mobile/app/experiments/${slug}.tsx`);
}

async function main(): Promise<void> {
  if (type === 'web') {
    await createWebExperiment();
  } else if (type === 'web-native') {
    await createWebNativeExperiment();
  } else {
    await createMobileExperiment();
  }

  console.log(`\n✅  Experiment "${titleCase}" scaffolded.`);

  if (type === 'web' || type === 'web-native') {
    console.log(`\n   Preview at: http://localhost:3000/lab/${slug}`);
  }
  if (type === 'web-native') {
    console.log(`   Native entry at: http://localhost:3000/exp/${slug}/index.html`);
  }
  if (type === 'mobile') {
    console.log(`\n   Mobile route at: /experiments/${slug}`);
  }
}

main().catch((err: unknown) => {
  console.error('❌  new-exp failed:', err);
  process.exit(1);
});
