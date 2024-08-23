/**
 * Spring Physics
 * Critically-damped spring for smooth, physically-based animations.
 * Works without any animation library — perfect for shader uniforms.
 */

export interface SpringConfig {
  /** Stiffness (default: 170) */
  stiffness?: number;
  /** Damping (default: 26) */
  damping?: number;
  /** Mass (default: 1) */
  mass?: number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

export interface Spring {
  state: SpringState;
  target: number;
  /** Step the simulation by `dt` seconds. Call in rAF loop. */
  tick: (dt: number) => number;
  /** Set a new target value */
  setTarget: (value: number) => void;
  /** Snap immediately to target */
  snap: (value: number) => void;
}

export function createSpring(initialValue = 0, config: SpringConfig = {}): Spring {
  const { stiffness = 170, damping = 26, mass = 1 } = config;

  const state: SpringState = { position: initialValue, velocity: 0 };
  let target = initialValue;

  function tick(dt: number): number {
    const springForce = -stiffness * (state.position - target);
    const dampForce = -damping * state.velocity;
    const acceleration = (springForce + dampForce) / mass;

    state.velocity += acceleration * dt;
    state.position += state.velocity * dt;

    // Rest detection
    if (Math.abs(state.velocity) < 0.001 && Math.abs(state.position - target) < 0.001) {
      state.position = target;
      state.velocity = 0;
    }

    return state.position;
  }

  return {
    state,
    get target() {
      return target;
    },
    tick,
    setTarget(value: number) {
      target = value;
    },
    snap(value: number) {
      target = value;
      state.position = value;
      state.velocity = 0;
    },
  };
}

/**
 * Vector3 spring — for animating THREE.Vector3 or similar
 */
export function createSpring3(initial: [number, number, number] = [0, 0, 0], config?: SpringConfig) {
  const springs = initial.map((v) => createSpring(v, config));
  return {
    tick(dt: number): [number, number, number] {
      return springs.map((s) => s.tick(dt)) as [number, number, number];
    },
    setTarget(target: [number, number, number]) {
      target.forEach((v, i) => springs[i]!.setTarget(v));
    },
    snap(value: [number, number, number]) {
      value.forEach((v, i) => springs[i]!.snap(v));
    },
    get position(): [number, number, number] {
      return springs.map((s) => s.state.position) as [number, number, number];
    },
  };
}
