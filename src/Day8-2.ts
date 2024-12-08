import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";

type Antenna = { x: number; y: number; frequency: string };

function parseInput(input: string): { antennas: Antenna[]; bounds: { width: number; height: number } } {
  const lines = input.trim().split('\n');
  const antennas: Antenna[] = [];
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];
      if (char !== '.') {
        antennas.push({ x, y, frequency: char });
      }
    }
  }
  return { antennas, bounds: { width: lines[0].length, height: lines.length } };
}

function calculateInLinePositions(a: Antenna, b: Antenna, bounds: { width: number; height: number }): [number, number][] {
  const positions: [number, number][] = [];

  if (a.frequency !== b.frequency) return positions;

  const dx = b.x - a.x;
  const dy = b.y - a.y;

  // Calculate GCD to normalize step size
  const gcd = (n: number, m: number): number => (m === 0 ? Math.abs(n) : gcd(m, n % m));
  const stepX = dx / gcd(dx, dy);
  const stepY = dy / gcd(dx, dy);

  // Extend in both directions
  let x = a.x;
  let y = a.y;

  // Include all positions from a to b and beyond in the negative direction
  while (x >= 0 && x < bounds.width && y >= 0 && y < bounds.height) {
    positions.push([x, y]);
    x -= stepX;
    y -= stepY;
  }

  // Reset and include all positions from a to b and beyond in the positive direction
  x = a.x + stepX;
  y = a.y + stepY;
  while (x >= 0 && x < bounds.width && y >= 0 && y < bounds.height) {
    positions.push([x, y]);
    x += stepX;
    y += stepY;
  }

  return positions;
}

function solveResonantCollinearityPart2(input: string): number {
  const { antennas, bounds } = parseInput(input);

  // Debug: Print parsed antennas
  log('Antennas:', antennas);

  const antinodesSet = new Set<string>();

  // Check all pairs of antennas
  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const a = antennas[i];
      const b = antennas[j];
      const inLinePositions = calculateInLinePositions(a, b, bounds);
      for (const [x, y] of inLinePositions) {
        antinodesSet.add(`${x},${y}`);
      }
    }
  }

  // Include all antenna positions if they are part of a valid pair
  for (const antenna of antennas) {
    if (antennas.filter(a => a.frequency === antenna.frequency && a !== antenna).length > 0) {
      antinodesSet.add(`${antenna.x},${antenna.y}`);
    }
  }

  // Debug: Print unique antinodes
  log('Unique Antinodes:', antinodesSet);

  return antinodesSet.size;
}

// Example Input
const exampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`.trim();

log('Number of Unique Antinode Positions (Part 2):', solveResonantCollinearityPart2(exampleInput)); // Should output 34


async function main() {
  const url = 'https://adventofcode.com/2024/day/8/input'
  const inputData = await getInputData(url)

  const result = solveResonantCollinearityPart2(inputData)
  console.log(result)

 
}

main().catch(console.error)
