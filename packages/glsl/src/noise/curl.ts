/**
 * Curl Noise — divergence-free noise field for fluid-like motion
 * Derived from two offset simplex noise samples
 * Chunk tag: #include "noise/curl"
 */

const curlGLSL = /* glsl */ `
// Curl Noise
// Requires snoise() to be defined first (import simplex chunk)

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float nx0 = snoise(p + dx);
  float nx1 = snoise(p - dx);
  float ny0 = snoise(p + dy);
  float ny1 = snoise(p - dy);
  float nz0 = snoise(p + dz);
  float nz1 = snoise(p - dz);

  vec3 curl;
  curl.x = (ny1 - ny0) - (nz1 - nz0);
  curl.y = (nz1 - nz0) - (nx1 - nx0);
  curl.z = (nx1 - nx0) - (ny1 - ny0);

  return curl / (2.0 * e);
}
`;

export default curlGLSL;
