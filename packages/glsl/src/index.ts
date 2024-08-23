/**
 * GLSL shader chunks as injectable TypeScript strings.
 *
 * Usage in a shader:
 *   import simplex from '@gi-lab/glsl/src/noise/simplex'
 *   const vertexShader = `${simplex}\n void main() { ... }`
 *
 * Or in a .glsl file with vite-plugin-glsl #include support:
 *   #include "../../node_modules/@gi-lab/glsl/src/noise/simplex.glsl"
 */

export { default as simplexNoise } from './noise/simplex';
export { default as curlNoise } from './noise/curl';
export { default as sdfPrimitives } from './raymarching/sdf';
export { default as rayMarchingLighting } from './raymarching/lighting';
export { default as uvDistort } from './uv/distort';
