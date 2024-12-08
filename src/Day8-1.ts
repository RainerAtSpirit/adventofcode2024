import { getInputData } from "./utils/getInputData";

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

function calculateAntinodes(a: Antenna, b: Antenna, bounds: { width: number; height: number }): [number, number][] {
  const antinodes: [number, number][] = [];
  if (a.frequency !== b.frequency) return antinodes;

  // Calculate dx and dy
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  // Calculate potential antinodes
  const antinode1: [number, number] = [a.x - dx, a.y - dy];
  const antinode2: [number, number] = [b.x + dx, b.y + dy];

  // Debug: Log antinodes
  // console.log(`Antinodes for (${a.x}, ${a.y}) and (${b.x}, ${b.y}):`, antinode1, antinode2);

  // Add valid antinodes within bounds
  if (antinodesInBounds(antinode1, bounds)) antinodes.push(antinode1);
  if (antinodesInBounds(antinode2, bounds)) antinodes.push(antinode2);

  return antinodes;
}

function antinodesInBounds([x, y]: [number, number], bounds: { width: number; height: number }): boolean {
  return x >= 0 && x < bounds.width && y >= 0 && y < bounds.height;
}

function solveResonantCollinearity(input: string): number {
  const { antennas, bounds } = parseInput(input);

  // Debug: Print parsed antennas
  // console.log('Antennas:', antennas);

  const antinodesSet = new Set<string>();

  // Check all pairs of antennas
  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const a = antennas[i];
      const b = antennas[j];
      const antinodes = calculateAntinodes(a, b, bounds);
      for (const [x, y] of antinodes) {
        antinodesSet.add(`${x},${y}`);
      }
    }
  }

  // Debug: Print unique antinodes
  // console.log('Unique Antinodes:', antinodesSet);

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

console.log('Number of Unique Antinode Positions:', solveResonantCollinearity(exampleInput)); // Should output 14


async function main() {
  const url = 'https://adventofcode.com/2024/day/8/input'
  const inputData = await getInputData(url)

  const result = solveResonantCollinearity(inputData)
  console.log(result)

 
}

main().catch(console.error)
