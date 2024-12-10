// import { getInputData } from "./utils/getInputData";
import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";

interface Position {
  x: number; // Column index
  y: number; // Row index
}


/**
 * Parses the raw input string into a 2D array of numbers representing the topographic map.
 * @param input - The raw input string.
 * @returns A 2D array where each sub-array represents a row of heights.
 */
function parseMap(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map(line => line.trim().split('').map(char => {
      const num = parseInt(char, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid character '${char}' in input. All characters must be digits 0-9.`);
      }
      return num;
    }));
}

/**
 * Finds all trailhead positions (height 0) on the map.
 * @param map - The 2D topographic map.
 * @returns An array of Positions representing trailheads.
 */
function findTrailheads(map: number[][]): Position[] {
  return map.flatMap((row, y) =>
    row
      .map((height, x) => (height === 0 ? { x, y } : null))
      .filter((position): position is Position => position !== null)
  );
}

/**
 * Finds all unique '9'-height positions reachable from a given trailhead via hiking trails.
 * @param map - The 2D topographic map.
 * @param trailhead - The starting trailhead position.
 * @returns A Set of strings representing unique reachable '9's in "x,y" format.
 */
function findReachableNines(map: number[][], trailhead: Position): Set<string> {
  const directions: Position[] = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }   // Right
  ];

  const queue: Position[] = [trailhead];
  const visited: Set<string> = new Set([`${trailhead.x},${trailhead.y}`]);
  const reachableNines: Set<string> = new Set();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentHeight = map[current.y][current.x];

    for (const direction of directions) {
      const newX = current.x + direction.x;
      const newY = current.y + direction.y;

      // Check map boundaries
      if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
        continue;
      }

      const nextHeight = map[newY][newX];
      const positionKey = `${newX},${newY}`;

      // Check if already visited
      if (visited.has(positionKey)) {
        continue;
      }

      // Check if the height increases by exactly 1
      if (nextHeight === currentHeight + 1) {
        visited.add(positionKey);
        const nextPosition: Position = { x: newX, y: newY };
        queue.push(nextPosition);

        // If the next height is 9, add to reachableNines
        if (nextHeight === 9) {
          reachableNines.add(positionKey);
        }
      }
    }
  }

  return reachableNines;
}

/**
 * Calculates the score for a given trailhead by counting reachable '9's.
 * @param map - The 2D topographic map.
 * @param trailhead - The trailhead position.
 * @returns The number of unique '9's reachable from the trailhead.
 */
function calculateTrailheadScore(map: number[][], trailhead: Position): number {
  const reachableNines = findReachableNines(map, trailhead);
  return reachableNines.size;
}

/**
 * Sums the scores of all trailheads on the map.
 * @param map - The 2D topographic map.
 * @param trailheads - An array of trailhead positions.
 * @returns The total sum of all trailhead scores.
 */
function sumTrailheadScores(map: number[][], trailheads: Position[]): number {
  return trailheads
    .map(trailhead => calculateTrailheadScore(map, trailhead))
    .reduce((acc, score) => acc + score, 0);
}


/**
 * Solves the "Hoof It" puzzle by calculating the sum of all trailhead scores.
 * @param input - The raw input string representing the topographic map.
 * @returns The total sum of all trailhead scores.
 */
function solveHoofIt(input: string): number {
  const map = parseMap(input);
  const trailheads = findTrailheads(map);
  const totalScore = sumTrailheadScores(map, trailheads);
  return totalScore;
}


const input3 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

log(solveHoofIt(input3)); // Output: 36

async function main() {
  const url = 'https://adventofcode.com/2024/day/10/input'
  const inputData = await getInputData(url)

  const result = solveHoofIt(inputData)
  console.log(result)

 
}

main().catch(console.error)
