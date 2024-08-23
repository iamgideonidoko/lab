/**
 * UV Distortion Utilities
 * Warping, kaleidoscope, polar coords, and lens distortion
 */

const uvDistortGLSL = /* glsl */ `
// UV Utilities

// Centered UV: maps [0,1] → [-0.5, 0.5]
vec2 centerUV(vec2 uv) {
  return uv - 0.5;
}

// Polar coordinates from centered UV
vec2 toPolar(vec2 uv) {
  vec2 c  = centerUV(uv);
  float r = length(c);
  float a = atan(c.y, c.x);
  return vec2(r, a);
}

// Lens / Barrel Distortion
vec2 barrelDistort(vec2 uv, float strength) {
  vec2  c   = centerUV(uv);
  float r2  = dot(c, c);
  float factor = 1.0 + strength * r2;
  return c * factor + 0.5;
}

// Kaleidoscope
vec2 kaleidoscope(vec2 uv, float segments) {
  vec2 polar = toPolar(uv);
  float angle = 3.14159265 / segments;
  polar.y     = abs(mod(polar.y, 2.0 * angle) - angle);
  return vec2(
    polar.x * cos(polar.y) + 0.5,
    polar.x * sin(polar.y) + 0.5
  );
}

// Domain Warp
// Classic "fbm domain warp" by Inigo Quilez — requires snoise()
vec2 domainWarp(vec2 uv, float strength, float frequency, float time) {
  vec2 q = vec2(
    snoise(vec3(uv * frequency, time)),
    snoise(vec3(uv * frequency + vec2(5.2, 1.3), time))
  );
  return uv + strength * q;
}

// Pixelate
vec2 pixelate(vec2 uv, float resolution) {
  return floor(uv * resolution) / resolution;
}

// Zoom / Pan
vec2 zoom(vec2 uv, float scale, vec2 center) {
  return (uv - center) / scale + center;
}
`;

export default uvDistortGLSL;
