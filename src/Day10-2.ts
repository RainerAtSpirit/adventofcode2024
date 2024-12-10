// import { getInputData } from "./utils/getInputData";
import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";

interface Position {
  x: number; // Column index
  y: number; // Row index
}

/**
 * Parses the raw input string into a 2D array of numbers representing the topographic map.
 * Converts '.' to -1 to denote impassable tiles.
 * @param input - The raw input string.
 * @returns A 2D array where each sub-array represents a row of heights.
 */
function parseMap(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map(line => line.trim().split('').map(char => {
      if (char === '.') {
        return -1; // Represent impassable tiles as -1
      }
      const num = parseInt(char, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid character '${char}' in input. All characters must be digits 0-9 or '.' for impassable.`);
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
 * Counts the number of distinct hiking trails from a given position to any '9'.
 * A hiking trail is a path that:
 * - Starts at the given position.
 * - Ends at any position with height '9'.
 * - Each step moves to an adjacent position (up, down, left, right) with height exactly +1.
 *
 * @param map - The 2D topographic map.
 * @param position - The current position.
 * @param memo - A memoization map to store computed trail counts.
 * @returns The number of distinct hiking trails from the current position.
 */
function countDistinctTrails(map: number[][], position: Position, memo: Map<string, number>): number {
  const { x, y } = position;
  const currentHeight = map[y][x];
  
  // If current position is impassable, return 0
  if (currentHeight === -1) {
    return 0;
  }

  const key = `${x},${y}`;

  // Base Case: If current position is '9', there's exactly one trail (ending here)
  if (currentHeight === 9) {
    return 1;
  }

  // If already computed, return the stored value
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const directions: Position[] = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }   // Right
  ];

  // Initialize trail count
  let trailCount = 0;

  // Explore all valid adjacent positions with height exactly +1
  directions.forEach(dir => {
    const newX = x + dir.x;
    const newY = y + dir.y;

    // Check map boundaries
    if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
      return;
    }

    const nextHeight = map[newY][newX];

    // Skip impassable tiles
    if (nextHeight === -1) {
      return;
    }

    if (nextHeight === currentHeight + 1) {
      trailCount += countDistinctTrails(map, { x: newX, y: newY }, memo);
    }
  });

  // Store the computed trail count in memo
  memo.set(key, trailCount);

  return trailCount;
}

/**
 * Calculates the rating of a given trailhead, defined as the number of distinct hiking trails
 * starting from that trailhead.
 *
 * @param map - The 2D topographic map.
 * @param trailhead - The trailhead position.
 * @param memo - A memoization map to store computed trail counts.
 * @returns The rating of the trailhead.
 */
function calculateTrailheadRating(map: number[][], trailhead: Position, memo: Map<string, number>): number {
  return countDistinctTrails(map, trailhead, memo);
}

/**
 * Sums the ratings of all trailheads on the map.
 *
 * @param map - The 2D topographic map.
 * @param trailheads - An array of trailhead positions.
 * @returns The total sum of all trailhead ratings.
 */
function sumTrailheadRatings(map: number[][], trailheads: Position[]): number {
  const memo = new Map<string, number>();
  return trailheads
    .map(trailhead => calculateTrailheadRating(map, trailhead, memo))
    .reduce((acc, rating) => acc + rating, 0);
}

/**
 * Solves the "Hoof It" Part Two puzzle by calculating the sum of all trailhead ratings.
 *
 * @param input - The raw input string representing the topographic map.
 * @returns The total sum of all trailhead ratings.
 */
function solveHoofItPartTwo(input: string): number {
  const map = parseMap(input);
  log('map', map)
  const trailheads = findTrailheads(map);
  log('trailheads', trailheads)
  const totalRating = sumTrailheadRatings(map, trailheads);
  
  return totalRating;
}


const input3 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

const totalRating3 = solveHoofItPartTwo(input3);
log(totalRating3); // Expected Output: 81

async function main() {
  const url = 'https://adventofcode.com/2024/day/10/input'
  const inputData = await getInputData(url)

  const result = solveHoofItPartTwo(inputData)
  console.log(result)

 
}

// main().catch(console.error)
