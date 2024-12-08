import { getInputData } from './utils/getInputData'

function countXMASOccurrences(grid: string[]): number {
  const word = "XMAS";
  const wordLength = word.length;
  const numRows = grid.length;
  const numCols = grid[0].length; // assuming rectangular grid

  // Directions: (dx, dy)
  // dx is movement along columns, dy is movement along rows
  // Right, Left, Down, Up, Diagonal Down-Right, Diagonal Down-Left, Diagonal Up-Right, Diagonal Up-Left
  const directions = [
    [1, 0],   // right
    [-1, 0],  // left
    [0, 1],   // down
    [0, -1],  // up
    [1, 1],   // down-right
    [1, -1],  // up-right
    [-1, 1],  // down-left
    [-1, -1]  // up-left
  ];

  let count = 0;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (grid[row][col] === word[0]) { // Check only if first char matches
        // Check each direction
        for (const [dx, dy] of directions) {
          let found = true;
          // Check the remaining characters of "XMAS" starting from index 1
          for (let i = 1; i < wordLength; i++) {
            const newX = col + dx * i;
            const newY = row + dy * i;

            // Check boundaries
            if (newX < 0 || newX >= numCols || newY < 0 || newY >= numRows) {
              found = false;
              break;
            }
            // Check character
            if (grid[newY][newX] !== word[i]) {
              found = false;
              break;
            }
          }

          if (found) {
            count++;
          }
        }
      }
    }
  }

  return count;
}



async function main() {
  const url = 'https://adventofcode.com/2024/day/4/input'
  const inputData = await getInputData(url)

  const lines = inputData.trim().split('\n');
  
  console.log(countXMASOccurrences(lines)) // sh
}

main().catch(console.error)
