import { getInputData } from './utils/getInputData'

function countXMasShapes(grid: string[]): number {
  const numRows = grid.length;
  const numCols = grid[0].length;
  
  let count = 0;
  
  // Check a diagonal of length 3 for "MAS" or "SAM"
  function diagonalMatches(ch1: string, ch2: string, ch3: string): {mas: boolean, sam: boolean} {
    const str = ch1 + ch2 + ch3;
    return {
      mas: str === "MAS",
      sam: str === "SAM"
    };
  }

  // Iterate over each cell to see if it can be the center of the X
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      // The center must be 'A'
      if (grid[r][c] === 'A') {
        // Check boundaries: we need r-1, r+1, c-1, c+1 to be valid
        if (r - 1 >= 0 && r + 1 < numRows && c - 1 >= 0 && c + 1 < numCols) {
          // Extract characters for diagonals
          const topLeft = grid[r - 1][c - 1];
          const bottomRight = grid[r + 1][c + 1];
          const topRight = grid[r - 1][c + 1];
          const bottomLeft = grid[r + 1][c - 1];

          // Check TL-BR diagonal
          const tlBr = diagonalMatches(topLeft, 'A', bottomRight);
          // Check TR-BL diagonal
          const trBl = diagonalMatches(topRight, 'A', bottomLeft);

          // We have 4 possible combos that count as an X-MAS:
          // 1) TL-BR = MAS and TR-BL = MAS
          // 2) TL-BR = MAS and TR-BL = SAM
          // 3) TL-BR = SAM and TR-BL = MAS
          // 4) TL-BR = SAM and TR-BL = SAM
          if (
            (tlBr.mas && trBl.mas) ||
            (tlBr.mas && trBl.sam) ||
            (tlBr.sam && trBl.mas) ||
            (tlBr.sam && trBl.sam)
          ) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

// Example usage:
const exampleGrid = [
  ".M.S......",
  "..A..MSMS.",
  ".M.S.MAA..",
  "..A.ASMSM.",
  ".M.S.M....",
  "..........",
  "S.S.S.S.S.",
  ".A.A.A.A..",
  "M.M.M.M.M.",
  ".........."
];

// According to the puzzle, this should print 9
console.log('sample', countXMasShapes(exampleGrid));



async function main() {
  const url = 'https://adventofcode.com/2024/day/4/input'
  const inputData = await getInputData(url)

  const lines = inputData.trim().split('\n');
  
  console.log(countXMasShapes(lines))
}

main().catch(console.error)
