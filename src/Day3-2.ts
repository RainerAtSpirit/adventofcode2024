import { getInputData } from './utils/getInputData'

function sumEnabledMuls(input: string): number {
  // Regex to capture do(), don't(), or mul(X,Y)
  const regex = /do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g;
  let match;
  let sum = 0;
  let enabled = true; // Initially enabled

  while ((match = regex.exec(input)) !== null) {
    if (match[0] === 'do()') {
      enabled = true;
    } else if (match[0] === "don't()") {
      enabled = false;
    } else if (match[1] !== undefined && match[2] !== undefined) {
      // This is a mul(X,Y) match
      if (enabled) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        sum += x * y;
      }
    }
  }

  return sum;
}

async function main() {
  const url = 'https://adventofcode.com/2024/day/3/input'
  const inputData = await getInputData(url)
  console.log(sumEnabledMuls(inputData)) // sh
}

main().catch(console.error)
