/**
 * Raymarching Lighting Model
 * Phong + soft shadows + ambient occlusion
 */

const lightingGLSL = /* glsl */ `
// Raymarching Core

// Forward-declare: implement map(vec3) → float in your experiment
float map(vec3 p);

vec3 calcNormal(vec3 p) {
  const float h = 0.0001;
  const vec2  k = vec2(1.0, -1.0);
  return normalize(
    k.xyy * map(p + k.xyy * h) +
    k.yyx * map(p + k.yyx * h) +
    k.yxy * map(p + k.yxy * h) +
    k.xxx * map(p + k.xxx * h)
  );
}

float rayMarch(vec3 ro, vec3 rd, float maxDist) {
  float t = 0.0;
  for (int i = 0; i < 128; i++) {
    vec3  p = ro + rd * t;
    float d = map(p);
    if (d < 0.001 || t > maxDist) break;
    t += d;
  }
  return t;
}

// Soft Shadows
float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
  float res = 1.0;
  float t   = mint;
  for (int i = 0; i < 64; i++) {
    float h = map(ro + rd * t);
    if (h < 0.001) return 0.0;
    res  = min(res, k * h / t);
    t   += h;
    if (t > maxt) break;
  }
  return clamp(res, 0.0, 1.0);
}

// Ambient Occlusion
float ambientOcclusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.01 + 0.12 * float(i) / 4.0;
    float d = map(p + h * n);
    occ    += (h - d) * sca;
    sca    *= 0.95;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

// Phong Shading
vec3 phongLight(vec3 p, vec3 n, vec3 ro, vec3 lightPos, vec3 lightCol, vec3 matCol) {
  vec3  ld   = normalize(lightPos - p);
  vec3  vd   = normalize(ro - p);
  vec3  hd   = normalize(ld + vd);
  float diff = max(dot(n, ld), 0.0);
  float spec = pow(max(dot(n, hd), 0.0), 32.0);
  float ao   = ambientOcclusion(p, n);
  vec3  amb  = 0.05 * matCol * ao;
  return amb + matCol * lightCol * diff + lightCol * spec * 0.3;
}
`;

export default lightingGLSL;
