import { getInputData } from './utils/getInputData'

// Function to check if a line is safe
function isSafeLine(levels: Array<number>): boolean {
  if (levels.length < 2) return false

  const firstDiff = levels[1] - levels[0]
  // Check initial difference
  if (firstDiff === 0 || Math.abs(firstDiff) > 3) {
    return false
  }

  const increasing = firstDiff > 0

  // Start from the second difference
  for (let i = 2; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1]

    // Check constraints for each consecutive difference
    if (diff === 0 || Math.abs(diff) > 3) {
      return false
    }

    // Check monotonicity
    if (increasing && diff <= 0) return false
    if (!increasing && diff >= 0) return false
  }

  return true
}

async function main() {
  const url = 'https://adventofcode.com/2024/day/2/input'
  const inputData = await getInputData(url)

  const lines = inputData.split('\n')

  // Use reduce for a functional style counting
  const safeCount = lines.reduce((count, line) => {
    const levels = line.split(' ').map(Number)
    return isSafeLine(levels) ? count + 1 : count
  }, 0)

  console.log('safeCount', safeCount)
}

main().catch(console.error)
