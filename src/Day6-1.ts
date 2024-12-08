import { getInputData } from "./utils/getInputData";

type Direction = [number, number];

const directions: Direction[] = [
  [0, -1], // North (dir=0)
  [1, 0],  // East  (dir=1)
  [0, 1],  // South (dir=2)
  [-1, 0], // West  (dir=3)
];

function parseInput(input: string): { map: string[][]; start: [number, number]; dir: number } {
  const map = input.trim().split('\n').map(line => line.split(''));
  let start: [number, number] = [0, 0];
  let dir = 0;

  let found = false;
  for (let y = 0; y < map.length && !found; y++) {
    for (let x = 0; x < map[y].length && !found; x++) {
      const symbol = map[y][x];
      if ('^v<>'.includes(symbol)) {
        // Map symbol to direction:
        // '^' = North = 0
        // '>' = East  = 1
        // 'v' = South = 2
        // '<' = West  = 3
        if (symbol === '^') dir = 0;
        else if (symbol === '>') dir = 1;
        else if (symbol === 'v') dir = 2;
        else if (symbol === '<') dir = 3;

        start = [x, y];
        map[y][x] = '.'; // Replace guard symbol with empty floor
        found = true;
      }
    }
  }

  return { map, start, dir };
}


function turnRight(direction: number): number {
  return (direction + 1) % 4;
}

function facingVector(direction: number): [number, number] {
  return directions[direction];
}

function isWithinBounds(map: string[][], x: number, y: number): boolean {
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
}

function isObstacle(map: string[][], x: number, y: number): boolean {
  if (!isWithinBounds(map, x, y)) return true; // Out of bounds treated as obstacle
  return map[y][x] === '#';
}

function tryMoveForward(map: string[][], x: number, y: number, direction: number): {
  x: number;
  y: number;
  direction: number;
  moved: boolean;
  outOfBounds: boolean;
} {
  const [dx, dy] = facingVector(direction);
  const nx = x + dx;
  const ny = y + dy;

  // Check out-of-bounds first
  if (!isWithinBounds(map, nx, ny)) {
    // The guard would leave the map
    return { x, y, direction, moved: false, outOfBounds: true };
  }

  // Within bounds, check for obstacle
  if (map[ny][nx] === '#') {
    // Turn right, but don't move
    return { x, y, direction: turnRight(direction), moved: false, outOfBounds: false };
  }

  // No obstacle, move forward
  return { x: nx, y: ny, direction, moved: true, outOfBounds: false };
}


function simulatePatrol(input: string): number {
  const { map, start, dir } = parseInput(input);

  const visited = new Set<string>();
  let [x, y] = start;
  let direction = dir;

  visited.add(`${x},${y}`);

  while (true) {
    const result = tryMoveForward(map, x, y, direction);
    if (result.outOfBounds) {
      // The guard leaves the map, break out of the loop
      break;
    }
    if (!result.moved) {
      // Just turned right, no movement
      x = result.x;
      y = result.y;
      direction = result.direction;
      continue;
    }
    // If we get here, guard moved forward
    x = result.x;
    y = result.y;
    direction = result.direction;
    visited.add(`${x},${y}`);
  }

  return visited.size;
}

// Example usage:
const exampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

console.log('sample', simulatePatrol(exampleInput)); // Should output 41


async function main() {
  const url = 'https://adventofcode.com/2024/day/6/input'
  const inputData = await getInputData(url)

  const lines = inputData.trim().split('\n')
  

  const result = simulatePatrol(inputData)
  console.log(result)

 
}

main().catch(console.error)
