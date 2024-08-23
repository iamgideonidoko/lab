/**
 * L-System (Lindenmayer System)
 * Generates fractal plant/structure strings via production rules.
 * Combine with a turtle graphics renderer for procedural geometry.
 */

export type LSystemRules = Record<string, string>;

export interface LSystemConfig {
  axiom: string;
  rules: LSystemRules;
  iterations: number;
}

export interface LSystemResult {
  sentence: string;
  /** Depth of expansion */
  generation: number;
}

export function lSystem({ axiom, rules, iterations }: LSystemConfig): LSystemResult {
  let sentence = axiom;

  for (let gen = 0; gen < iterations; gen++) {
    sentence = sentence
      .split('')
      .map((char) => rules[char] ?? char)
      .join('');
  }

  return { sentence, generation: iterations };
}

/**
 * 3D Turtle Interpreter
 * Converts an L-System sentence into 3D line segments.
 */
export interface TurtleState {
  position: [number, number, number];
  forward: [number, number, number];
  up: [number, number, number];
  right: [number, number, number];
}

export interface TurtleConfig {
  stepLength?: number;
  angle?: number; // degrees
}

export type LineSegment = {
  from: [number, number, number];
  to: [number, number, number];
};

function rotateY(v: [number, number, number], angle: number): [number, number, number] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]];
}

function rotateX(v: [number, number, number], angle: number): [number, number, number] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]];
}

export function interpretLSystem(sentence: string, config: TurtleConfig = {}): LineSegment[] {
  const { stepLength = 1, angle = 25 } = config;
  const rad = (angle * Math.PI) / 180;

  const stack: TurtleState[] = [];
  const segments: LineSegment[] = [];

  let state: TurtleState = {
    position: [0, 0, 0],
    forward: [0, 1, 0],
    up: [0, 0, 1],
    right: [1, 0, 0],
  };

  for (const char of sentence) {
    switch (char) {
      case 'F':
      case 'G': {
        const from = [...state.position] as [number, number, number];
        state.position = [
          state.position[0] + state.forward[0] * stepLength,
          state.position[1] + state.forward[1] * stepLength,
          state.position[2] + state.forward[2] * stepLength,
        ];
        segments.push({ from, to: [...state.position] as [number, number, number] });
        break;
      }
      case '+':
        state.forward = rotateY(state.forward, rad);
        break;
      case '-':
        state.forward = rotateY(state.forward, -rad);
        break;
      case '^':
        state.forward = rotateX(state.forward, rad);
        break;
      case '&':
        state.forward = rotateX(state.forward, -rad);
        break;
      case '[':
        stack.push({
          position: [...state.position] as [number, number, number],
          forward: [...state.forward] as [number, number, number],
          up: [...state.up] as [number, number, number],
          right: [...state.right] as [number, number, number],
        });
        break;
      case ']':
        if (stack.length > 0) state = stack.pop()!;
        break;
    }
  }

  return segments;
}

export const L_SYSTEM_PRESETS = {
  /** Sierpiński triangle */
  sierpinski: {
    axiom: 'F-G-G',
    rules: { F: 'F-G+F+G-F', G: 'GG' },
    iterations: 5,
  },
  /** Koch snowflake */
  kochSnowflake: {
    axiom: 'F++F++F',
    rules: { F: 'F-F++F-F' },
    iterations: 4,
  },
  /** Fractal plant */
  plant: {
    axiom: 'X',
    rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
    iterations: 5,
  },
  /** Dragon curve */
  dragonCurve: {
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    iterations: 10,
  },
} as const satisfies Record<string, LSystemConfig>;
