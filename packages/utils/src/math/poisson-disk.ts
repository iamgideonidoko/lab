/**
 * Poisson Disk Sampling
 * Generates well-distributed random points with a minimum distance constraint.
 * Useful for: particle placement, texture sampling, procedural generation.
 */

export interface PoissonDiskOptions {
  width: number;
  height: number;
  /** Minimum distance between samples */
  minDistance: number;
  /** Max attempts before rejecting a candidate (default: 30) */
  maxAttempts?: number;
  /** Optional seeded random function — defaults to Math.random */
  random?: () => number;
}

export type Point2D = [x: number, y: number];

export function poissonDisk({
  width,
  height,
  minDistance,
  maxAttempts = 30,
  random = Math.random,
}: PoissonDiskOptions): Point2D[] {
  const r = minDistance;
  const cellSize = r / Math.SQRT2;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  const grid: (Point2D | null)[] = new Array(cols * rows).fill(null);
  const samples: Point2D[] = [];
  const active: Point2D[] = [];

  const gridIdx = ([x, y]: Point2D) => Math.floor(x / cellSize) + Math.floor(y / cellSize) * cols;

  const addSample = (p: Point2D) => {
    samples.push(p);
    active.push(p);
    grid[gridIdx(p)] = p;
  };

  addSample([random() * width, random() * height]);

  while (active.length > 0) {
    const idx = Math.floor(random() * active.length);
    const origin = active[idx]!;
    let found = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const angle = random() * Math.PI * 2;
      const dist = r + random() * r;
      const candidate: Point2D = [origin[0] + Math.cos(angle) * dist, origin[1] + Math.sin(angle) * dist];

      if (candidate[0] < 0 || candidate[0] >= width || candidate[1] < 0 || candidate[1] >= height) continue;

      const cx = Math.floor(candidate[0] / cellSize);
      const cy = Math.floor(candidate[1] / cellSize);
      let valid = true;

      for (let nx = cx - 2; nx <= cx + 2 && valid; nx++) {
        for (let ny = cy - 2; ny <= cy + 2 && valid; ny++) {
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
          const neighbor = grid[nx + ny * cols];
          if (!neighbor) continue;
          const dx = candidate[0] - neighbor[0];
          const dy = candidate[1] - neighbor[1];
          if (dx * dx + dy * dy < r * r) valid = false;
        }
      }

      if (valid) {
        addSample(candidate);
        found = true;
        break;
      }
    }

    if (!found) active.splice(idx, 1);
  }

  return samples;
}
