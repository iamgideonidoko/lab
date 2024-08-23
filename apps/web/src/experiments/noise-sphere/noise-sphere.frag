// Noise Sphere Fragment Shader

uniform vec3 uColorA; // primary color (design token primary.500)
uniform vec3 uColorB; // accent color  (design token accent.500)
uniform float uTime;
uniform float uRimPower;

varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Base colour from displacement
  vec3 color = mix(uColorA, uColorB, smoothstep(0.2, 0.8, vDisplacement));

  // Rim lighting
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  float rimMask = pow(rim, uRimPower);
  color += uColorB * rimMask * 0.6;

  // Subtle fresnel glow pulse
  float pulse = sin(uTime * 0.8) * 0.5 + 0.5;
  color += uColorA * rimMask * pulse * 0.15;

  gl_FragColor = vec4(color, 1.0);
}
